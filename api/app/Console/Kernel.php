<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Services\AlertService;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        $schedule->call(function () {
            app(AlertService::class)->checkPriceDrops();
        })->hourly()->name('price-drop-alerts')->withoutOverlapping();

        $schedule->call(function () {
            app(AlertService::class)->checkStockAlerts();
        })->everyThirtyMinutes()->name('stock-alerts')->withoutOverlapping();
    }
}
