<?php

namespace App\Services;

use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Support\Facades\Log;

class AlertService
{
    public function checkPriceDrops(): int
    {
        $alertCount = 0;

        Wishlist::where('price_drop_alert', true)
            ->with('product')
            ->chunk(100, function ($wishlists) use (&$alertCount) {
                foreach ($wishlists as $wishlist) {
                    $currentPrice = $wishlist->product->effective_price;
                    $addedPrice   = (float) $wishlist->price_when_added;

                    if ($currentPrice < $addedPrice) {
                        $dropPercent = round((($addedPrice - $currentPrice) / $addedPrice) * 100);

                        $this->sendPriceDropNotification(
                            $wishlist->user,
                            $wishlist->product,
                            $addedPrice,
                            $currentPrice,
                            $dropPercent
                        );

                        $alertCount++;
                    }
                }
            });

        Log::info("Price drop alerts sent: {$alertCount}");
        return $alertCount;
    }

    public function checkStockAlerts(): int
    {
        $alertCount = 0;

        Wishlist::where('stock_alert', true)
            ->whereHas('product', fn($q) => $q->where('stock', '>', 0))
            ->with('product')
            ->chunk(100, function ($wishlists) use (&$alertCount) {
                foreach ($wishlists as $wishlist) {
                    if ($wishlist->product->is_in_stock) {
                        $this->sendStockAlertNotification(
                            $wishlist->user,
                            $wishlist->product
                        );

                        $wishlist->update(['stock_alert' => false]);
                        $alertCount++;
                    }
                }
            });

        Log::info("Stock alerts sent: {$alertCount}");
        return $alertCount;
    }

    public function onProductPriceChange(Product $product, float $oldPrice): void
    {
        $newPrice = $product->effective_price;

        if ($newPrice >= $oldPrice) return;

        $wishlists = Wishlist::where('product_id', $product->id)
            ->where('price_drop_alert', true)
            ->where('price_when_added', '>', $newPrice)
            ->with('user')
            ->get();

        foreach ($wishlists as $wishlist) {
            $dropPercent = round((($oldPrice - $newPrice) / $oldPrice) * 100);
            $this->sendPriceDropNotification(
                $wishlist->user,
                $product,
                $oldPrice,
                $newPrice,
                $dropPercent
            );
        }
    }

    public function onProductRestock(Product $product): void
    {
        $wishlists = Wishlist::where('product_id', $product->id)
            ->where('stock_alert', true)
            ->with('user')
            ->get();

        foreach ($wishlists as $wishlist) {
            $this->sendStockAlertNotification($wishlist->user, $product);
            $wishlist->update(['stock_alert' => false]);
        }
    }

    private function sendPriceDropNotification($user, $product, float $oldPrice, float $newPrice, int $percent): void
    {
        Log::info("Price Drop Alert", [
            'user'    => $user->email,
            'product' => $product->name,
            'old'     => $oldPrice,
            'new'     => $newPrice,
            'drop'    => "{$percent}%",
        ]);
    }

    private function sendStockAlertNotification($user, $product): void
    {
        Log::info("Stock Alert", [
            'user'    => $user->email,
            'product' => $product->name,
            'stock'   => $product->stock,
        ]);
    }
}
