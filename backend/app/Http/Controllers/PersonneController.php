<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Personne;
use App\Trait\HttpResponses;
use Illuminate\Http\Request;

class PersonneController extends Controller
{
    use HttpResponses;
    /**
     * Afficher toutes les personnes
     */
    public function index()
    {
        $personnes = Personne::all();
        return $this->success($personnes, '', 200);
    }

    /**
     * Ajouter une nouvelle personne
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'NOM' => 'required|string|max:100',
            'PRENOM' => 'required|string|max:100',
            'DATE_NAISSANCE' => 'required|date',
            'TELEPHONE' => 'nullable|string|max:20',
            'GENRE' => 'required|string|in:Homme,Femme',
            'EMAIL' => 'nullable|email|unique:personne,EMAIL'
        ]);

        $personne = Personne::create($validated);

        return $this->success($personne, 'Personne crée avec succès !', 201);
    }

    /**
     * Afficher une personne par son ID
     */
    public function show($id)
    {
        $personne = Personne::find($id);

        if (!$personne) {
            return response()->json(['message' => 'Personne non trouvée'], 404);
        }

        return $this->success($personne, '',200);
    }

    /**
     * Mettre à jour une personne
     */
    public function update(Request $request, $id)
    {
        $personne = Personne::find($id);

        if (!$personne) {
            return $this->error(null, 'Personne non trouvée', 404);
        }

        $validated = $request->validate([
            'NOM' => 'sometimes|string|max:100',
            'PRENOM' => 'sometimes|string|max:100',
            'DATE_NAISSANCE' => 'sometimes|string',
            'TELEPHONE' => 'sometimes|string|max:20',
            'GENRE' => 'sometimes|string|in:Homme,Femme,femme,homme',
            'EMAIL' => 'sometimes|email'
        ]);

        $personne->update($validated);

        return $this->success($personne, "Personne modifié avec succès !",200);
    }

    /**
     * Supprimer une personne
     */
    public function destroy($id)
    {
        $personne = Personne::find($id);

        if (!$personne) {
            return $this->error(null, 'Personne non trouvée', 404);
        }

        $personne->delete();

        return $this->success(null, 'Personne supprimée avec succès', 200);
    }
}
