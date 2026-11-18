<?php

use App\Http\Controllers\Api\ChauffeurController;
use App\Http\Controllers\Api\DirecteurGeneralController;
use App\Http\Controllers\Api\DirecteurRegionalController;
use App\Http\Controllers\Api\RegionController;
use App\Http\Controllers\Api\UtilisateurController;
use App\Http\Controllers\Api\VehiculeController;
use Illuminate\Support\Facades\Route;

Route::apiResource('utilisateurs', UtilisateurController::class)
    ->parameters(['utilisateurs' => 'utilisateur']);

Route::apiResource('directeurs-generaux', DirecteurGeneralController::class)
    ->parameters(['directeurs-generaux' => 'directeurGeneral']);

Route::apiResource('directeurs-regionaux', DirecteurRegionalController::class)
    ->parameters(['directeurs-regionaux' => 'directeurRegional']);

Route::apiResource('regions', RegionController::class)
    ->parameters(['regions' => 'region']);

Route::apiResource('chauffeurs', ChauffeurController::class)
    ->parameters(['chauffeurs' => 'chauffeur']);

Route::apiResource('vehicules', VehiculeController::class)
    ->parameters(['vehicules' => 'vehicule']);
