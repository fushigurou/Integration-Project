<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DirecteurGeneralController;
use App\Http\Controllers\Api\DirecteurRegionalController;
use App\Http\Controllers\Api\UtilisateurController;
use Illuminate\Support\Facades\Route;

Route::post('auth/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/refresh', [AuthController::class, 'refresh']);
    Route::post('auth/logout', [AuthController::class, 'logout']);

    Route::apiResource('utilisateurs', UtilisateurController::class)
        ->parameters(['utilisateurs' => 'utilisateur']);

    Route::apiResource('directeurs-generaux', DirecteurGeneralController::class)
        ->parameters(['directeurs-generaux' => 'directeurGeneral']);

    Route::apiResource('directeurs-regionaux', DirecteurRegionalController::class)
        ->parameters(['directeurs-regionaux' => 'directeurRegional']);
});
