<?php

namespace App\Http\Controllers;

use App\Models\MenuSpecialise;
use App\Trait\HttpResponses;
use Illuminate\Http\Request;

class MenuSpecialiseController extends Controller
{
    use HttpResponses;

    /**
     * Liste des menus spécialisés.
     */
    public function index()
    {
        return $this->success(MenuSpecialise::all());
    }

    /**
     * Création d'un menu spécialisé.
     */
    public function store(Request $request)
    {
        $request->validate([
            'ID_MENU' => 'required|exists:menu,ID_MENU',
            'ID_PATIENT' => 'required|exists:patient,ID_PATIENT',
        ]);

        $menuSpecialise = MenuSpecialise::create($request->only(['ID_MENU', 'ID_PATIENT']));

        return $this->success($menuSpecialise, 'Menu spécialisé créé avec succès', 201);
    }

    /**
     * Affichage d'un menu spécialisé.
     */
    public function show($id)
    {
        $menuSpecialise = MenuSpecialise::find($id);

        if (!$menuSpecialise) {
            return $this->error(null, 'Menu spécialisé introuvable', 404);
        }

        return $this->success($menuSpecialise);
    }

    /**
     * Mise à jour d'un menu spécialisé.
     */
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

    /**
     * Suppression d'un menu spécialisé.
     */
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
