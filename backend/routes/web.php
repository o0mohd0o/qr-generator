<?php

use App\Http\Controllers\UrlController;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

// Welcome page
Route::get('/', function () {
    return view('welcome');
});

// Sanctum CSRF cookie route - ensure it's accessible and properly configured
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])->middleware('web');

// These routes are already defined in api.php, so we don't need them here
// Route::prefix('api')->group(function () {
//     Route::post('/shorten', [UrlController::class, 'shorten']);
//     Route::get('/stats/{shortCode}', [UrlController::class, 'statistics']);
// });

// Redirect route - must be at the bottom to avoid conflicts
Route::get('/{shortCode}', [UrlController::class, 'redirect']);

