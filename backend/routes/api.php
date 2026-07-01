<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\SmsController;
use App\Http\Controllers\Admin\EmailController;

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/verify-phone', [AuthController::class, 'verifyPhone']);
    Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
    Route::get('/google/redirect', [AuthController::class, 'redirectToGoogle']);
    Route::get('/google/callback', [AuthController::class, 'googleCallback']);
});

// Public Shop Routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/settings', [SiteSettingController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::middleware('isAdmin')->prefix('admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('products', ProductController::class);
        Route::apiResource('categories', CategoryController::class);
        Route::put('/settings/{key}', [SiteSettingController::class, 'update']);
        
        // SMS Management
        Route::get('/sms/providers', [SmsController::class, 'providers']);
        Route::put('/sms/providers/{id}', [SmsController::class, 'updateProvider']);
        Route::get('/sms/logs', [SmsController::class, 'logs']);
        Route::post('/sms/send-test', [SmsController::class, 'sendTest']);
        
        // Email Management
        Route::get('/email/logs', [EmailController::class, 'logs']);
        Route::post('/email/send', [EmailController::class, 'send']);
    });
});
