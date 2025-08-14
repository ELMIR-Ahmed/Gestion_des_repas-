<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\AllergieController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PlatController;
use App\Http\Controllers\RepasController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/utilisateurs', [AdminController::class, 'getUsers']);
Route::get('/utilisateurs/{id}', [AdminController::class, 'getUser']);
Route::post('/utilisateurs', [AdminController::class, 'createUser']);
Route::put('/utilisateurs/{id}', [AdminController::class, 'updateUser']);
Route::delete('/utilisateurs/{id}', [AdminController::class, 'deleteUser']);
Route::delete('/utilisateurs', [AdminController::class, 'deleteUsers']);


Route::apiResource('ingredients', IngredientController::class);
Route::apiResource('allergies', AllergieController::class);

Route::get('/plats', [PlatController::class, 'index']);
Route::get('/plats/{id}', [PlatController::class, 'show']);
Route::post('/plats', [PlatController::class, 'store']);
Route::put('/plats/{id}', [PlatController::class, 'update']);
Route::delete('/plats/{id}', [PlatController::class, 'destroy']);


Route::get('/repas', [RepasController::class, 'index']);
Route::get('/repas/{id}', [RepasController::class, 'show']);
Route::post('/repas', [RepasController::class, 'store']);
Route::put('/repas/{id}', [RepasController::class, 'update']);
Route::delete('/repas/{id}', [RepasController::class, 'destroy']);

Route::get('/menus', [MenuController::class, 'index']);
Route::get('/menus/{id}', [MenuController::class, 'show']);
Route::post('/menus', [MenuController::class, 'store']);
Route::put('/menus/{id}', [MenuController::class, 'update']);
Route::delete('/menus/{id}', [MenuController::class, 'destroy']);