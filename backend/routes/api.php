<?php

use App\Http\Controllers\UrlController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// CSRF token endpoint - duplicating it here since the frontend is trying to access it with /api prefix
Route::get('sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

// Public endpoints that don't require authentication
Route::post('shorten', [\App\Http\Controllers\UrlController::class, 'shorten']);
Route::get('stats/{shortCode}', [\App\Http\Controllers\UrlController::class, 'statistics']);

