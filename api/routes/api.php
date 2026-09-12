<?php

use Illuminate\Support\Facades\Route;

/*
|──────────────────────────────────────
| API Versioning: /api/v1/...
|──────────────────────────────────────
*/
Route::prefix('v1')->group(function () {
    require base_path('routes/api/v1.php');
});
