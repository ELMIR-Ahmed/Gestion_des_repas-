<?php

namespace App\Http\Controllers;

use App\Models\Repas;
use App\Trait\HttpResponses;
use Illuminate\Http\Request;

class RepasController extends Controller
{
    use HttpResponses;


    public function index()
    {
        $repas = Repas::with('plats.ingredients.allergies')->get();

        if ($repas->isEmpty()) {
            return $this->error(null, 'Aucun repas trouvé !', 404);
        }

        return $this->success($repas, "", 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'NOM_REPAS' => 'required|string',
            'HORAIRE' => 'required|date',
            'PLATS' => 'array',
            'PLATS.*' => 'exists:plat,ID_PLAT',
        ]);

        $repas = Repas::create($request->all());

        $repas->plats()->attach($request->PLATS);

        $repas->load('plats.ingredients.allergies');

        return $this->success($repas, 'Repas created successfully', 201);
    }


    public function show($id)
    {
        $repas = Repas::with('plats.ingredients.allergies')->find($id);

        if (!$repas) {
            return $this->error(null, 'Repas not found', 404);
        }

        return $this->success($repas);
    }

    public function update(Request $request, $id)
    {
        $repas = Repas::find($id);

        if (!$repas) {
            return $this->error(null, 'Repas not found', 404);
        }

        $request->validate([
            'NOM_REPAS' => 'sometimes|required|string',
            'HORAIRE' => 'sometimes|required|date',
            'PLATS' => 'sometimes|array',
            'PLATS.*' => 'exists:plat,ID_PLAT',
        ]); 

        $repas->update($request->all());
        
        if($request->has('PLATS')) {
            $repas->plats()->sync($request->PLATS);
        }

        $repas->load('plats.ingredients.allergies');

        return $this->success($repas, 'Repas updated successfully');
    }

    public function destroy($id)
    {
        $repas = Repas::find($id);

        if (!$repas) {
            return $this->error(null, 'Repas not found', 404);
        }

        $repas->delete();

        return $this->success(null, 'Repas deleted successfully');
    }
}
