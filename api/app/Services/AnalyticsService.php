<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    // ═══════════════════════════════
    //  DASHBOARD OVERVIEW
    // ═══════════════════════════════

    public function dashboardOverview(): array
    {
        $today = now()->startOfDay();
        $yesterday = now()->subDay()->startOfDay();

        $todaySales = Order::where('created_at', '>=', $today)
            ->whereNotIn('status', ['cancelled', 'refunded'])
            ->sum('total');

        $todayOrders = Order::where('created_at', '>=', $today)->count();

        $yesterdaySales = Order::whereBetween('created_at', [$yesterday, $today])
            ->whereNotIn('status', ['cancelled', 'refunded'])
            ->sum('total');

        $yesterdayOrders = Order::whereBetween('created_at', [$yesterday, $today])->count();

        $totalCustomers = User::whereHas('roles', fn ($q) => $q->where('name', 'customer'))->count();
        $totalProducts  = Product::count();
        $activeProducts = Product::active()->count();

        $pendingOrders = Order::where('status', 'pending')->count();
        $lowStock      = Product::active()->where('stock', '>', 0)->where('stock', '<=', 10)->count();
        $outOfStock    = Product::active()->where('stock', 0)->count();

        return [
            'today' => [
                'sales'          => (float) $todaySales,
                'orders'         => $todayOrders,
                'sales_change'   => $yesterdaySales > 0
                    ? round((($todaySales - $yesterdaySales) / $yesterdaySales) * 100, 1)
                    : 0,
                'orders_change'  => $yesterdayOrders > 0
                    ? round((($todayOrders - $yesterdayOrders) / $yesterdayOrders) * 100, 1)
                    : 0,
            ],
            'totals' => [
                'customers'       => $totalCustomers,
                'products'        => $totalProducts,
                'active_products' => $activeProducts,
            ],
            'alerts' => [
                'pending_orders' => $pendingOrders,
                'low_stock'      => $lowStock,
                'out_of_stock'   => $outOfStock,
            ],
        ];
    }

    // ═══════════════════════════════
    //  SALES ANALYTICS
    // ═══════════════════════════════

    public function salesAnalytics(string $period = '30d'): array
    {
        $dateRange = $this->getDateRange($period);

        $revenueData = Order::whereBetween('created_at', $dateRange)
            ->whereNotIn('status', ['cancelled', 'refunded'])
            ->selectRaw('DATE(created_at) as date, SUM(total) as revenue, COUNT(*) as orders')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'date'    => $row->date,
                'revenue' => (float) $row->revenue,
                'orders'  => (int) $row->orders,
            ]);

        $totalRevenue = Order::whereBetween('created_at', $dateRange)
            ->whereNotIn('status', ['cancelled', 'refunded'])
            ->sum('total');

        $previousRange = $this->getPreviousDateRange($period);
        $previousRevenue = Order::whereBetween('created_at', $previousRange)
            ->whereNotIn('status', ['cancelled', 'refunded'])
            ->sum('total');

        $avgOrderValue = Order::whereBetween('created_at', $dateRange)
            ->whereNotIn('status', ['cancelled', 'refunded'])
            ->avg('total');

        $paymentBreakdown = Order::whereBetween('created_at', $dateRange)
            ->where('payment_status', 'paid')
            ->selectRaw('payment_method, COUNT(*) as count, SUM(total) as revenue')
            ->groupBy('payment_method')
            ->get();

        $statusDistribution = Order::whereBetween('created_at', $dateRange)
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        return [
            'total_revenue'       => (float) $totalRevenue,
            'revenue_change'      => $previousRevenue > 0
                ? round((($totalRevenue - $previousRevenue) / $previousRevenue) * 100, 1)
                : 0,
            'total_orders'        => (int) $revenueData->sum('orders'),
            'avg_order_value'     => round((float) $avgOrderValue, 2),
            'revenue_chart'       => $revenueData,
            'payment_breakdown'   => $paymentBreakdown,
            'status_distribution' => $statusDistribution,
        ];
    }

    // ═══════════════════════════════
    //  PRODUCT PERFORMANCE
    // ═══════════════════════════════

    public function productPerformance(string $period = '30d', int $limit = 10): array
    {
        $dateRange = $this->getDateRange($period);

        $topProducts = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->whereBetween('orders.created_at', $dateRange)
            ->whereNotIn('orders.status', ['cancelled', 'refunded'])
            ->selectRaw('
                products.id,
                products.name,
                products.sku,
                SUM(order_items.quantity) as total_sold,
                SUM(order_items.total) as total_revenue,
                AVG(order_items.unit_price) as avg_price
            ')
            ->groupBy('products.id', 'products.name', 'products.sku')
            ->orderByDesc('total_sold')
            ->limit($limit)
            ->get();

        $topCategories = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->whereBetween('orders.created_at', $dateRange)
            ->whereNotIn('orders.status', ['cancelled', 'refunded'])
            ->selectRaw('
                categories.id,
                categories.name,
                COUNT(DISTINCT order_items.product_id) as product_count,
                SUM(order_items.quantity) as total_sold,
                SUM(order_items.total) as total_revenue
            ')
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('total_revenue')
            ->limit($limit)
            ->get();

        $mostViewed = Product::active()
            ->select('id', 'name', 'sku', 'views_count', 'sales_count', 'avg_rating')
            ->orderByDesc('views_count')
            ->limit($limit)
            ->get();

        $totalViews = Product::sum('views_count');
        $totalSales = Product::sum('sales_count');
        $conversionRate = $totalViews > 0
            ? round(($totalSales / $totalViews) * 100, 2)
            : 0;

        return [
            'top_products'    => $topProducts,
            'top_categories'  => $topCategories,
            'most_viewed'     => $mostViewed,
            'conversion_rate' => $conversionRate,
        ];
    }

    // ═══════════════════════════════
    //  CUSTOMER ANALYTICS
    // ═══════════════════════════════

    public function customerAnalytics(string $period = '30d'): array
    {
        $dateRange = $this->getDateRange($period);

        $customerGrowth = User::whereHas('roles', fn ($q) => $q->where('name', 'customer'))
            ->whereBetween('created_at', $dateRange)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $topCustomers = DB::table('orders')
            ->join('users', 'users.id', '=', 'orders.user_id')
            ->whereBetween('orders.created_at', $dateRange)
            ->whereNotIn('orders.status', ['cancelled', 'refunded'])
            ->selectRaw('
                users.id,
                users.name,
                users.email,
                COUNT(orders.id) as order_count,
                SUM(orders.total) as total_spent,
                AVG(orders.total) as avg_order
            ')
            ->groupBy('users.id', 'users.name', 'users.email')
            ->orderByDesc('total_spent')
            ->limit(10)
            ->get();

        $repeatCustomers = DB::table('orders')
            ->whereBetween('created_at', $dateRange)
            ->whereNotIn('status', ['cancelled', 'refunded'])
            ->selectRaw('user_id, COUNT(*) as order_count')
            ->groupBy('user_id')
            ->havingRaw('COUNT(*) > 1')
            ->count();

        $totalCustomers = DB::table('orders')
            ->whereBetween('created_at', $dateRange)
            ->distinct('user_id')
            ->count('user_id');

        return [
            'customer_growth'  => $customerGrowth,
            'top_customers'    => $topCustomers,
            'repeat_customers' => $repeatCustomers,
            'total_active'     => $totalCustomers,
            'retention_rate'   => $totalCustomers > 0
                ? round(($repeatCustomers / $totalCustomers) * 100, 1)
                : 0,
        ];
    }

    // ═══════════════════════════════
    //  HELPERS
    // ═══════════════════════════════

    private function getDateRange(string $period): array
    {
        return match ($period) {
            '7d'    => [now()->subDays(7)->startOfDay(), now()->endOfDay()],
            '30d'   => [now()->subDays(30)->startOfDay(), now()->endOfDay()],
            '90d'   => [now()->subDays(90)->startOfDay(), now()->endOfDay()],
            '12m'   => [now()->subMonths(12)->startOfDay(), now()->endOfDay()],
            'ytd'   => [now()->startOfYear(), now()->endOfDay()],
            default => [now()->subDays(30)->startOfDay(), now()->endOfDay()],
        };
    }

    private function getPreviousDateRange(string $period): array
    {
        return match ($period) {
            '7d'    => [now()->subDays(14)->startOfDay(), now()->subDays(7)->endOfDay()],
            '30d'   => [now()->subDays(60)->startOfDay(), now()->subDays(30)->endOfDay()],
            '90d'   => [now()->subDays(180)->startOfDay(), now()->subDays(90)->endOfDay()],
            '12m'   => [now()->subMonths(24)->startOfDay(), now()->subMonths(12)->endOfDay()],
            'ytd'   => [now()->subYear()->startOfYear(), now()->subYear()->endOfYear()],
            default => [now()->subDays(60)->startOfDay(), now()->subDays(30)->endOfDay()],
        };
    }
}