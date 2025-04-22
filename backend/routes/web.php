<?php

use App\Http\Controllers\UrlController;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

// Welcome page
Route::get('/', function () {
    return view('welcome');
});

// Sanctum CSRF cookie route
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

// Redirect route - must be at the bottom to avoid conflicts
Route::get('/{shortCode}', [UrlController::class, 'redirect']);

