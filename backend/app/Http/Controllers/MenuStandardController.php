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
        return $this->success(MenuStandard::all(), "", 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'menu_id' => 'required|exists:menus,id',
        ]);

        $menuStandard = MenuStandard::create($request->all());

        return $this->success($menuStandard, 'MenuStandard created successfully', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $menuStandard = MenuStandard::find($id);

        if (!$menuStandard) {
            return $this->error(null, 'MenuStandard not found', 404);
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

        $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'menu_id' => 'sometimes|required|exists:menus,id',
        ]);

        $menuStandard->update($request->all());

        return $this->success($menuStandard, 'MenuStandard updated successfully');
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

        return $this->success(null, 'MenuStandard deleted successfully');
    }
}
