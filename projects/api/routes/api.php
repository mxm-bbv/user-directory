<?php

use App\Http\Controllers\Api\Actions\UsersController;
use Illuminate\Support\Facades\Route;

Route::middleware('accept.json')
    ->prefix('v1')
    ->name('api.')
    ->group(function () {
        Route::prefix('users')
            ->name('users.')
            ->group(function () {
                Route::get('', [UsersController::class, 'index'])->name('index');
                Route::post('', [UsersController::class, 'store'])->name('store');
                Route::prefix('{user}')->group(function () {
                    Route::put('', [UsersController::class, 'update'])->name('update');
                    Route::post('block', [UsersController::class, 'block'])->name('block');
                    Route::post('unblock', [UsersController::class, 'unblock'])->name('unblock');
                });
            });
    });
