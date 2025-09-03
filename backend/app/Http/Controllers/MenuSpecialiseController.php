<?php

namespace App\Http\Controllers;

use App\Models\MenuSpecialise;
use App\Trait\HttpResponses;
use Illuminate\Http\Request;

class MenuSpecialiseController extends Controller
{
    use HttpResponses;


    public function index()
    {
        $menuSpecialise = MenuSpecialise::with('patient', 'menu.repas.plats')->get();

        if ($menuSpecialise->isEmpty()) {
            return $this->error(null, 'Aucun menu personnalisé trouvé ! ', 404);
        }

        return $this->success($menuSpecialise, '', 200);
    }


    public function store(Request $request)
    {
        $request->validate([
            'ID_MENU' => 'required|exists:menu,ID_MENU',
            'ID_PATIENT' => 'required|exists:patient,ID_PATIENT',
        ]);

        $menuSpecialise = MenuSpecialise::create($request->only(['ID_MENU', 'ID_PATIENT']));

        return $this->success($menuSpecialise, 'Menu spécialisé créé avec succès', 201);
    }


    public function show($id)
    {
        $menuSpecialise = MenuSpecialise::with('patient', 'menu.repas.plats')->find($id);

        if (!$menuSpecialise) {
            return $this->error(null, 'Menu personnalisé introuvable', 404);
        }

        return $this->success($menuSpecialise, '', 200);
    }


    public function update(Request $request, $id)
    {
        $menuSpecialise = MenuSpecialise::find($id);

        if (!$menuSpecialise) {
            return $this->error(null, 'Menu spécialisé introuvable', 404);
        }

        $request->validate([
            'ID_MENU' => 'sometimes|required|exists:menu,ID_MENU',
            'ID_PATIENT' => 'sometimes|required|exists:patient,ID_PATIENT',
        ]);

        $menuSpecialise->update($request->only(['ID_MENU', 'ID_PATIENT']));

        return $this->success($menuSpecialise, 'Menu spécialisé mis à jour avec succès');
    }


    public function destroy($id)
    {
        $menuSpecialise = MenuSpecialise::find($id);

        if (!$menuSpecialise) {
            return $this->error(null, 'Menu spécialisé introuvable', 404);
        }

        $menuSpecialise->delete();

        return $this->success(null, 'Menu spécialisé supprimé avec succès');
    }
}
