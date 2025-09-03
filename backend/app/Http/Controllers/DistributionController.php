<?php

namespace App\Http\Controllers;

use App\Models\Distribution;
use Illuminate\Http\Request;
use App\Trait\HttpResponses;

class DistributionController extends Controller
{
    use HttpResponses;

    public function index()
    {
        $distributions = Distribution::with('service', 'patients', 'repas')->get();

        if ($distributions->isEmpty()) {
            return $this->error(null, 'Aucune distribution trouvé ! ', 404);
        }

        return $this->success($distributions, "Liste des distributions récupérée avec succès", 200);
    }

    public function show($id)
    {
        $distribution = Distribution::with('service', 'patients', 'repas')->find($id);

        if (!$distribution) {
            return $this->error(null, "Distribution introuvable", 404);
        }

        return $this->success($distribution, "Distribution trouvée", 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "ID_DISTRIBUTEUR" => 'required|exists:distributeur,ID_DISTRIBUTEUR',
            "ID_SERVICE" => 'required|exists:service,ID_SERVICE',
            "ID_REPAS" => 'required|exists:repas,ID_REPAS',
            "DATE_DITRIBUTION" => 'required|date',
            "DATE_FIN_DISTRIBUTION" => 'required|date',
            "STATUT" => 'required|string'
        ]);

        $distribution = Distribution::create($validated);

        return $this->success($distribution, "Distribution créée avec succès", 201);
    }

    public function update(Request $request, $id)
    {
        $distribution = Distribution::find($id);

        if (!$distribution) {
            return $this->error(null, "Distribution introuvable", 404);
        }

        $validated = $request->validate([
            "ID_DISTRIBUTEUR" => 'required|exists:distributeur,ID_DISTRIBUTEUR',
            "ID_SERVICE" => 'required|exists:service,ID_SERVICE',
            "ID_REPAS" => 'required|exists:repas,ID_REPAS',
            "DATE_DITRIBUTION" => 'required|date',
            "DATE_FIN_DISTRIBUTION" => 'required|date',
            "STATUT" => 'required|string'
        ]);

        $distribution->update($validated);

        return $this->success($distribution, "Distribution mise à jour avec succès");
    }

    public function destroy($id)
    {
        $distribution = Distribution::find($id);

        if (!$distribution) {
            return $this->error(null, "Distribution introuvable", 404);
        }

        $distribution->delete();

        return $this->success(null, "Distribution supprimée avec succès", 204);
    }
}
