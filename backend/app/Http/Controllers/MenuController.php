<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Trait\HttpResponses;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    use HttpResponses;

    /**
     * Afficher la liste des menus.
     */
    public function index()
    {
        $menus = Menu::with('dieteticien', 'repas.plats')->get();

        if($menus->isEmpty()){
            return $this->error(null, "Aucun Menu trouvé ! ", 404);
        }

        return $this->success($menus, '', 200);
    }

    /**
     * Créer un nouveau menu.
     */
    public function store(Request $request)
    {
        $request->validate([
            'ID_DIETETICIEN' => 'required|exists:dieteticien,ID_DIETETICIEN',
            'DATE_DEBUT' => 'required|date',
            'DATE_CREATION' => 'required|date',
            'DATE_FIN' => 'required|date|after_or_equal:DATE_DEBUT',
            'REPAS' => 'array',
            'REPAS.*' => 'required|exists:repas,ID_REPAS'
        ]);

        $menu = Menu::create($request->only([
            'ID_DIETETICIEN',
            'DATE_DEBUT',
            'DATE_CREATION',
            'DATE_FIN',
        ]));

        if(isset($request['REPAS'])) {
            $menu->repas()->attach($request['REPAS']);
        }

        return $this->success($menu, 'Menu créé avec succès', 201);
    }

    /**
     * Afficher un menu spécifique.
     */
    public function show($id)
    {
        $menu = Menu::with('dieteticien', 'repas.plats')->find($id);

        if (!$menu) {
            return $this->error(null, 'Menu introuvable', 404);
        }

        return $this->success($menu);
    }

    /**
     * Mettre à jour un menu.
     */
    public function update(Request $request, $id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return $this->error(null, 'Menu introuvable', 404);
        }

        $request->validate([
            'ID_DIETETICIEN' => 'sometimes|required|exists:dieteticien,ID_DIETETICIEN',
            'DATE_DEBUT' => 'sometimes|required|date',
            'DATE_CREATION' => 'sometimes|required|date',
            'DATE_FIN' => 'sometimes|required|date|after_or_equal:DATE_DEBUT',
            'REPAS' => 'array',
            'REPAS.*' => 'required|exists:repas,ID_REPAS'
        ]);

        $menu->update($request->only([
            'ID_DIETETICIEN',
            'DATE_DEBUT',
            'DATE_CREATION',
            'DATE_FIN',
        ]));

        $menu->repas()->sync($request['REPAS']);

        return $this->success($menu, 'Menu mis à jour avec succès', 200);
    }

    /**
     * Supprimer un menu.
     */
    public function destroy($id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return $this->error(null, 'Menu introuvable', 404);
        }

        $menu->delete();

        return $this->success(null, 'Menu supprimé avec succès');
    }
}
