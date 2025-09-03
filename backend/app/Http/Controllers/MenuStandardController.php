<?php

namespace App\Http\Controllers;

use App\Models\MenuStandard;
use Illuminate\Http\Request;
use App\Trait\HttpResponses;

class MenuStandardController extends Controller
{
    use HttpResponses;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $menus_standard = MenuStandard::with('service', 'menu.repas.plats')->get();

        if($menus_standard->isEmpty()) {
            return $this->error(null, 'Aucun menu standard trouvé !', 404);
        }

        return $this->success($menus_standard, "", 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'ID_MENU' => 'required|exists:menu,ID_MENU',
            'ID_SERVICE' => 'required|exists:service,ID_SERVICE',
        ]);

        $menuStandard = MenuStandard::create($validatedData);

        $menuStandard->load("service");

        return $this->success($menuStandard, 'Menu Standard crée avec succès pour le service ' . $menuStandard->service->NOM_SERVICE  . ' !', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $menuStandard = MenuStandard::with('service', 'menu.repas.plats')->find($id);

        if (!$menuStandard) {
            return $this->error(null, 'MenuStandard non trouvé !', 404);
        }

        return $this->success($menuStandard);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $menuStandard = MenuStandard::find($id);

        if (!$menuStandard) {
            return $this->error(null, 'MenuStandard not found', 404);
        }

        $validatedData = $request->validate([
            'ID_MENU' => 'sometimes|exists:menu,ID_MENU',
            'ID_SERVICE' => 'sometimes|exists:service,ID_SERVICE',
        ]);

        $menuStandard->update($validatedData);

        return $this->success($menuStandard, 'MenuStandard updated successfully', 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $menuStandard = MenuStandard::find($id);

        if (!$menuStandard) {
            return $this->error(null, 'MenuStandard not found', 404);
        }

        $menuStandard->delete();

        return $this->success(null, 'MenuStandard deleted successfully', 200);
    }
}
