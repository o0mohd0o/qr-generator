<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Add CORS headers to all responses
        app('router')->matched(function () {
            if (request()->isMethod('OPTIONS')) {
                app()->abort(200, '', [
                    'Access-Control-Allow-Origin' => 'http://localhost:3000',
                    'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With, Accept, X-XSRF-TOKEN',
                    'Access-Control-Allow-Credentials' => 'true',
                    'Access-Control-Max-Age' => '86400'
                ]);
            }
        });

        app()->afterResolving(function ($response) {
            if (!$response) return;
            if (method_exists($response, 'header')) {
                $response->header('Access-Control-Allow-Origin', 'http://localhost:3000');
                $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                $response->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-XSRF-TOKEN');
                $response->header('Access-Control-Allow-Credentials', 'true');
            }
        });
    }
}
