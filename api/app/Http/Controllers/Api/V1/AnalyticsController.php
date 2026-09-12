<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function __construct(
        private AnalyticsService $analytics
    ) {}

    public function dashboard()
    {
        return response()->json([
            'success' => true,
            'data'    => $this->analytics->dashboardOverview(),
        ]);
    }

    public function sales(Request $request)
    {
        $period = $request->input('period', '30d');

        return response()->json([
            'success' => true,
            'data'    => $this->analytics->salesAnalytics($period),
        ]);
    }

    public function products(Request $request)
    {
        $period = $request->input('period', '30d');
        $limit  = min((int) $request->input('limit', 10), 50);

        return response()->json([
            'success' => true,
            'data'    => $this->analytics->productPerformance($period, $limit),
        ]);
    }

    public function customers(Request $request)
    {
        $period = $request->input('period', '30d');

        return response()->json([
            'success' => true,
            'data'    => $this->analytics->customerAnalytics($period),
        ]);
    }
}