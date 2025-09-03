<?php

namespace App\Http\Controllers;

use App\Models\Lit;
use App\Trait\HttpResponses;
use Illuminate\Http\Request;

class LitController extends Controller
{
    use HttpResponses;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lits = Lit::with('salle.service', 'patient')->get();

        if($lits->isEmpty()) {
            return $this->error(null, "Aucun lit trouvé !", 404);
        }

        return $this->success($lits, '', 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            "ID_SALLE" => "required|exists:salle,ID_SALLE",
            "NUM_LIT" => "required|int|min:1"
        ]);

        $lit = Lit::create($validatedData);

        return $this->success($lit, 'Lit crée avec succès !', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $lit = Lit::with('salle')->find($id);

        if(!$lit) {
            return $this->error(null, 'Lit introuvable !', 404);
        }

        return $this->success($lit, '', 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $lit = Lit::find($id);

        $validatedData = $request->validate([
            "ID_SALLE" => "sometimes|exists:salle,ID_SALLE",
            "NUM_LIT" => "sometimes|int|min:1"
        ]);

        $lit->update($validatedData);

        return $this->success($lit, 'lit modifié avec succès !', 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $Lit = Lit::find($id);

        if (!$Lit) {
            return $this->error(null, 'Lit introuvable !', 404);
        }

        $Lit->delete();

        return $this->success(null, 'Lit supprimée avec succès !', 200);
    }
}
