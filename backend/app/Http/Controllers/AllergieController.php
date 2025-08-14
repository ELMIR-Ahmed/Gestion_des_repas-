<?php

namespace App\Http\Controllers;

use App\Models\Allergie;
use App\Trait\HttpResponses;
use Illuminate\Http\Request;

class AllergieController extends Controller
{
    use HttpResponses;

    public function index()
    {
        $allergies = Allergie::all();

        if($allergies->isEmpty()) {
            return $this->error(null, "Aucune allergie trouvé !", 404);
        }

        return $this->success($allergies, "", 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'NOM_ALLERGIE' => 'required|string',
        ]);

        $allergie = Allergie::create([
            'NOM_ALLERGIE' => $validatedData['NOM_ALLERGIE']
        ]);

        return $this->success($allergie, "Allergie '" .$allergie->NOM_ALLERGIE. "' est crée avec succès !");
    }

    public function show(Allergie $allergy)
    {
        return $this->success($allergy, "Allergie trouvé !", 200);
    }

    public function update(Request $request, Allergie $allergy)
    {
        $validatedData = $request->validate([
            'NOM_ALLERGIE' => 'required|string',
        ]);

        $allergy->update([
            'NOM_ALLERGIE' => $validatedData["NOM_ALLERGIE"]
        ]);
        
        return $this->success($allergy, "Allergie modifié avec succès !", 201);
    }

    public function destroy(Allergie $allergy)
    {

        $deleted = $allergy->delete();

        if($deleted) {
            return $this->success(null, "Allergie Supprimé avec succès !", 200);
        }

    }
}
