<?php

namespace App\Http\Controllers;

use App\Models\Salle;
use App\Trait\HttpResponses;
use Illuminate\Http\Request;

class SalleController extends Controller
{
    use HttpResponses;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $salles = Salle::with('service', 'lits.patient')->get();

        if ($salles->isEmpty()) {
            return $this->error(null, 'Aucune salle trouvée !', 404);
        }

        return $this->success($salles, '', 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'ID_SERVICE' => 'required|exists:service,ID_SERVICE',
            'NOM_SALLE' => 'required|string'
        ]);

        $salle = Salle::create($validatedData);

        return $this->success($salle, 'Salle créée avec succès !', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $salle = Salle::with('service', 'lits')->find($id);

        if (!$salle) {
            return $this->error(null, 'Salle introuvable !', 404);
        }

        return $this->success($salle, '', 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $salle = Salle::find($id);

        if (!$salle) {
            return $this->error(null, 'Salle introuvable !', 404);
        }

        $validatedData = $request->validate([
            'ID_SERVICE' => 'sometimes|exists:service,ID_SERVICE',
            'NOM_SALLE' => 'sometimes|string'
        ]);

        $salle->update($validatedData);

        return $this->success($salle, 'Salle mise à jour avec succès !', 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $salle = Salle::find($id);

        if (!$salle) {
            return $this->error(null, 'Salle introuvable !', 404);
        }

        $salle->delete();

        return $this->success(null, 'Salle supprimée avec succès !', 200);
    }
}
