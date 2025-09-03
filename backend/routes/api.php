<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\AllergieController;
use App\Http\Controllers\PersonneController;
use App\Http\Controllers\DistributionController;
use App\Http\Controllers\LitController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\MenuSpecialiseController;
use App\Http\Controllers\MenuStandardController;
use App\Http\Controllers\PathologieController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PlatController;
use App\Http\Controllers\RepasController;
use App\Http\Controllers\SalleController;
use App\Http\Controllers\ServiceController;

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

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);
Route::post('/services', [ServiceController::class, 'store']);
Route::put('/services/{id}', [ServiceController::class, 'update']);
Route::delete('/services/{id}', [ServiceController::class, 'destroy']);

Route::get('/salles', [SalleController::class, 'index']);
Route::get('/salles/{id}', [SalleController::class, 'show']);
Route::post('/salles', [SalleController::class, 'store']);
Route::put('/salles/{id}', [SalleController::class, 'update']);
Route::delete('/salles/{id}', [SalleController::class, 'destroy']);

Route::get('/lits', [LitController::class, 'index']);
Route::get('/lits/{id}', [LitController::class, 'show']);
Route::post('/lits', [LitController::class, 'store']);
Route::put('/lits/{id}', [LitController::class, 'update']);
Route::delete('/lits/{id}', [LitController::class, 'destroy']);

Route::get('/patients', [PatientController::class, 'index']);
Route::get('/patients/{id}', [PatientController::class, 'show']);
Route::post('/patients', [PatientController::class, 'store']);
Route::put('/patients/{id}', [PatientController::class, 'update']);
Route::delete('/patients/{id}', [PatientController::class, 'destroy']);

Route::get('/pathologies', [PathologieController::class, 'index']);
Route::get('/pathologies/{id}', [PathologieController::class, 'show']);
Route::post('/pathologies', [PathologieController::class, 'store']);
Route::put('/pathologies/{id}', [PathologieController::class, 'update']);
Route::delete('/pathologies/{id}', [PathologieController::class, 'destroy']);

Route::get('/menustandard', [MenuStandardController::class, 'index']);
Route::get('/menustandard/{id}', [MenuStandardController::class, 'show']);
Route::post('/menustandard', [MenuStandardController::class, 'store']);
Route::put('/menustandard/{id}', [MenuStandardController::class, 'update']);
Route::delete('/menustandard/{id}', [MenuStandardController::class, 'destroy']);

Route::get('/menuspeciale', [MenuSpecialiseController::class, 'index']);
Route::get('/menuspeciale/{id}', [MenuSpecialiseController::class, 'show']);
Route::post('/menuspeciale', [MenuSpecialiseController::class, 'store']);
Route::put('/menuspeciale/{id}', [MenuSpecialiseController::class, 'update']);
Route::delete('/menuspeciale/{id}', [MenuSpecialiseController::class, 'destroy']);

Route::get('/distributions', [DistributionController::class, 'index']);
Route::get('/distributions/{id}', [DistributionController::class, 'show']);
Route::post('/distributions', [DistributionController::class, 'store']);
Route::put('/distributions/{id}', [DistributionController::class, 'update']);
Route::delete('/distributions/{id}', [DistributionController::class, 'destroy']);

Route::get('/personnes', [PersonneController::class, 'index']);
Route::get('/personnes/{id}', [PersonneController::class, 'show']);
Route::post('/personnes', [PersonneController::class, 'store']);
Route::put('/personnes/{id}', [PersonneController::class, 'update']);
Route::delete('/personnes/{id}', [PersonneController::class, 'destroy']);