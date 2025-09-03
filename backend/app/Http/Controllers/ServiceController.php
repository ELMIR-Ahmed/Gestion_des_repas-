<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Trait\HttpResponses;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    use HttpResponses;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $services = Service::with('salles.lits')->get();

        if ($services->isEmpty()) {
            return $this->error(null, 'Aucun service trouvé !', 404);
        }

        return $this->success($services, '', 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'NOM_SERVICE' => 'required|string',
            'DESCRIPTION' => 'sometimes|string'
        ]);

        $service_created = Service::create($validatedData);

        if ($service_created) {
            return $this->success($service_created, 'Service créé avec succès !', 201);
        } else {
            return $this->error(null, 'Problème lors de la création du service !', 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $service = Service::with('salles.lits')->find($id);

        if (!$service) {
            return $this->error(null, 'Service introuvable !', 404);
        }

        return $this->success($service, null, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $service = Service::find($id);

        if (!$service) {
            return $this->error(null, 'Service introuvable !', 404);
        }

        $validatedData = $request->validate([
            'NOM_SERVICE' => 'sometimes|string',
            'DESCRIPTION' => 'sometimes|string'
        ]);

        $service->update($validatedData);

        return $this->success($service, 'Service mis à jour avec succès !', 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $service = Service::find($id);

        if (!$service) {
            return $this->error(null, 'Service introuvable !', 404);
        }

        $service->delete();

        return $this->success(null, 'Service supprimé avec succès !', 200);
    }
}
