<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     *
     * @return void
     */

    public function boot() {
        parent::boot();
    }

    public function map() {
        $this->mapApiRoutes();
        $this->mapWebRoutes();
        $this->mapAdminRoutes();
        $this->mapStudentRoutes();
    }

    protected function mapApiRoutes () {
        Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/api.php'));
    }

    protected function mapWebRoutes () {
        Route::middleware('web')
            ->namespace($this->namespace)
            ->group(base_path('routes/web.php'));
    }

    protected function mapAdminRoutes () {
        Route::prefix('admin')
            ->namespace($this->namespace)
            ->group(base_path('routes/admin.php'));
    }

    protected function mapStudentRoutes () {
        Route::prefix('student')
            ->namespace($this->namespace)
            ->group(base_path('routes/student.php'));
    }
}
