<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Trait\HttpResponses;
use Illuminate\Http\Request;

class IngredientController extends Controller
{

    use HttpResponses;

    public function index()
    {
        $ingredients = Ingredient::with('allergies')->get();

        if($ingredients->isEmpty()) {
            return $this->error(null, "Aucun Ingredient trouvé ! ", 404);
        }

        return $this->success($ingredients, "", 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'NOM_INGREDIENT' => 'required|string',
            'TYPE_INGREDIENT' => 'required|string',
            'ALLERGIES' => 'array',
            'ALLERGIES.*' => 'exists:allergie,ID_ALLERGIE',
        ]);

        $ingredient = Ingredient::create([
            'NOM_INGREDIENT' => $request->NOM_INGREDIENT,
            'TYPE_INGREDIENT' => $request->TYPE_INGREDIENT,
        ]);

        if ($request->has('ALLERGIES')) {
            $ingredient->allergies()->attach($request->ALLERGIES);
        }

        $ingredient->load('allergies');

        return $this->success($ingredient, "Ingrédient créé avec succès !", 201);
    }

    public function show(Ingredient $ingredient)
    {
        $ingredient->load("allergies");
        return $this->success($ingredient, "", 200);
    }

    public function update(Request $request, Ingredient $ingredient)
    {
        $request->validate([
            'NOM_INGREDIENT' => 'sometimes|required|string',
            'TYPE_INGREDIENT' => 'sometimes|required|string',
            'ALLERGIES' => 'sometimes|array',
            'ALLERGIES.*' => 'exists:allergie,ID_ALLERGIE',
        ]);

        if ($request->has('NOM_INGREDIENT')) {
            $ingredient->NOM_INGREDIENT = $request->NOM_INGREDIENT;
        }

        if ($request->has('TYPE_INGREDIENT')) {
            $ingredient->TYPE_INGREDIENT = $request->TYPE_INGREDIENT;
        }

        $ingredient->save();

        // Mise à jour des allergies (synchronisation)
        if ($request->has('ALLERGIES')) {
            $ingredient->allergies()->sync($request->ALLERGIES);
        }

        // Charger les relations mises à jour
        $ingredient->load('allergies');

        return $this->success($ingredient, "Ingrédient mis à jour avec succès !", 201);
    }

    public function destroy(Ingredient $ingredient)
    {
        $ingredient->delete();
        return $this->success(null, "Ingredient supprimé avec succès !");
    }
}
