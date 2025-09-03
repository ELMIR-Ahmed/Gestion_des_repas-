<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Personne;
use App\Trait\HttpResponses;
use Illuminate\Contracts\Support\ValidatedData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatientController extends Controller
{

    use HttpResponses;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $patients = Patient::with('personne', 'lit.salle.service', 'allergies', 'pathologies')->get();

        if($patients->isEmpty()) {
            return $this->error(null, 'Aucun patient trouvé !', 404);
        }

        return $this->success($patients, '', 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'NOM' => 'required|string', 
            'PRENOM' => 'required|string', 
            'DATE_NAISSANCE' => 'required|date', 
            'TELEPHONE' => 'required|string', 
            'GENRE' => 'required|string', 
            'EMAIL' => 'required|string',
            'DATE_ADMISSION' => 'required|date',
            'ID_LIT' => 'sometimes|integer|exists:lit,ID_LIT',
            'PATHOLOGIES' => 'array',
            'PATHOLOGIES.*' => 'exists:pathologie,ID_PATHOLOGIE',
            'ALLERGIES' => 'array',
            'ALLERGIES.*' => 'exists:allergie,ID_ALLERGIE'
        ]);

        DB::beginTransaction();
        try {
            $personne = Personne::create([
                'NOM' => $validatedData["NOM"], 
                'PRENOM' => $validatedData["PRENOM"], 
                'DATE_NAISSANCE' => $validatedData["DATE_NAISSANCE"], 
                'TELEPHONE' => $validatedData["TELEPHONE"], 
                'GENRE' => $validatedData["GENRE"], 
                'EMAIL' => $validatedData["EMAIL"],
                'DATE_ADMISSION' => $validatedData["DATE_ADMISSION"]
            ]);

            $patient = Patient::create([
                "ID_PERSONNE" => $personne->ID_PERSONNE,
                "ID_LIT" => $validatedData["ID_LIT"],
                "DATE_ADMISSION" => $validatedData["DATE_ADMISSION"]
            ]);

            if (isset($validatedData['ALLERGIES'])) {
                $patient->allergies()->attach($validatedData['ALLERGIES']);
            }

            if (isset($validatedData['PATHOLOGIES'])) {
                $patient->pathologies()->attach($validatedData['PATHOLOGIES']);
            }

            DB::commit();
            
            return $this->success($patient, '', 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error(
                $e,
                "Problème lors de la création du patient !",
                500
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $patient = Patient::with('personne', 'lit')->find($id);

        if(!$patient) {
            return $this->error(null, "Patient non trouvé !", 404);
        }

        return $this->success($patient, '', 200);
    }


    public function update(Request $request, $id)
    {
        $patient = Patient::with('personne')->find($id);

        if (!$patient) {
            return $this->error(null, "Patient non trouvé !", 404);
        }

        $validatedData = $request->validate([
            'NOM' => 'sometimes|string',
            'PRENOM' => 'sometimes|string',
            'DATE_NAISSANCE' => 'sometimes|date',
            'TELEPHONE' => 'sometimes|string',
            'GENRE' => 'sometimes|string',
            'EMAIL' => 'sometimes|string',
            'DATE_ADMISSION' => 'sometimes|date',
            'ID_LIT' => 'sometimes|integer|exists:lit,ID_LIT',
            'PATHOLOGIES' => 'array',
            'PATHOLOGIES.*' => 'sometimes|exists:pathologie,ID_PATHOLOGIE',
            'ALLERGIES' => 'array',
            'ALLERGIES.*' => 'sometimes|exists:allergie,ID_ALLERGIE',
        ]);

        DB::beginTransaction();
        try {
            // Mise à jour de la personne liée
            $patient->personne->update($request->only([
                'NOM', 'PRENOM', 'DATE_NAISSANCE', 'TELEPHONE', 'GENRE', 'EMAIL'
            ]));

            // Mise à jour du patient
            $patient->update($request->only([
                'DATE_ADMISSION', 'ID_LIT'
            ]));

            if (isset($validatedData['ALLERGIES'])) {
                $patient->allergies()->sync($validatedData['ALLERGIES']);
            }

            if (isset($validatedData['PATHOLOGIES'])) {
                $patient->pathologies()->sync   ($validatedData['PATHOLOGIES']);
            }

            DB::commit();
            return $this->success($patient->load('personne', 'lit'), "Patient mis à jour avec succès !", 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error($e->getMessage(), "Problème lors de la mise à jour du patient !", 500);
        }
    }

    public function destroy($id)
    {
        $patient = Patient::with('personne')->find($id);

        if (!$patient) {
            return $this->error(null, "Patient non trouvé !", 404);
        }

        $patient->personne->delete();

        return $this->success(null, 'Patient supprimé avec succès !');
    }
}
