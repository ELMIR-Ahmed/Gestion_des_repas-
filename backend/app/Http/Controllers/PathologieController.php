<?php

namespace App\Http\Controllers;

use App\Models\Pathologie;
use App\Trait\HttpResponses;
use Illuminate\Http\Request;

class PathologieController extends Controller
{
    use HttpResponses;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pathologies = Pathologie::all();

        if($pathologies->isEmpty()) {
            return $this->error(null, 'Aucune pathologie trouvé !', 404);
        }

        return $this->success($pathologies, '', 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            "NOM_PATHOLOGIE" => "required|string"
        ]);

        $pathologie = Pathologie::create($validatedData);

        return $this->success($pathologie, 'Pathologie crée avec succès !', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $pathologie = Pathologie::find($id);

        if(!$pathologie) { 
            return $this->error(null, 'Pathologie non trouvé !', 404);
        }

        return $this->success($pathologie, '', 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $pathologie = Pathologie::find($id);

        if(!$pathologie) { 
            return $this->error(null, 'Pathologie non trouvé !', 404);
        }

        $validatedData = $request->validate([
            "NOM_PATHOLOGIE" => "required|string"
        ]);

        $pathologie->update($validatedData);

        return $this->success($pathologie, 'Pathologie modifié avec succès', 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        Pathologie::destroy($id);

        return $this->success(null, 'Pathologie supprimé avec succès !');
    }
}
