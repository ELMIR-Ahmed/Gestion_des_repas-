<?php

namespace App\Http\Controllers;

use App\Models\Plat;
use App\Trait\HttpResponses;
use Illuminate\Http\Request;

class PlatController extends Controller
{
    use HttpResponses;

    public function index()
    {
        $plats = Plat::with('ingredients')->get();

        if($plats->isEmpty()) {
            return $this->error(null, 'Aucun plat pour le moment', 404);
        }

        return $this->success($plats, '', 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'NOM_PLAT' => 'required|string|max:50',
            'DESCRIPTION' => 'nullable|string',
            'INGREDIENTS' => 'array',
            'INGREDIENTS.*' => 'exists:ingredient,ID_INGREDIENT',
        ]);

        $plat = Plat::create($request->all());

        if($request->has('INGREDIENTS')) {
            $plat->ingredients()->attach($request->INGREDIENTS);
        }

        $plat->load('ingredients');

        return $this->success($plat, 'Plat created successfully', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $plat = Plat::with('ingredients')->find($id);

        if (!$plat) {
            return $this->error(null, 'Plat not found', 404);
        }

        return $this->success($plat, 'Plat Trouvé !', 200);
    }


    public function update(Request $request, $id)
    {
        $plat = Plat::find($id);

        if (!$plat) {
            return $this->error(null, 'Plat not found', 404);
        }

        $request->validate([
            'NOM_PLAT' => 'sometimes|required|string|max:50',
            'DESCRIPTION' => 'sometimes|nullable|string',
            'INGREDIENTS' => 'sometimes|array',
            'INGREDIENTS.*' => 'exists:ingredient,ID_INGREDIENT',
        ]);

        if($request->has(['NOM_PLAT', 'DESCRIPTION'])) {
            $plat->update([
                'NOM_PLAT' => $request->NOM_PLAT,
                'DESCRIPTION' => $request->DESCRIPTION
            ]);
        }

        if($request->has('INGREDIENTS')) {
            $plat->ingredients()->sync($request->INGREDIENTS);
        }

        $plat->load('ingredients.allergies');

        return $this->success($plat, 'Plat updated successfully', 201);
    }

    public function destroy($id)
    {
        $plat = Plat::find($id);

        if (!$plat) {
            return $this->error(null, 'Plat not found', 404);
        }

        $plat->delete();

        return $this->success(null, 'Plat deleted successfully');
    }
}
