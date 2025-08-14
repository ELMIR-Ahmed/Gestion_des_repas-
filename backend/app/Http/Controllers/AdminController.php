<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Admin;
use App\Models\Cuisinier;
use App\Models\Dieteticien;
use App\Models\Distributeur;
use App\Models\Patient;
use App\Models\Personne;
use App\Models\Utilisateur;
use App\Trait\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    use HttpResponses;

    public function getUsers() {
        $utilisateurs = Utilisateur::get();

        if ($utilisateurs->isEmpty()) {
            return $this->error(null , 'Aucun utilisateur trouvé !', 404);
        }
        
        $utilisateurs->each(function ($user) {
            $user->load('personne');
            if($user["ROLE"] === "dieteticien") {
                    $user->load('dieteticien');
                } elseif ($user["ROLE"] === 'cuisinier') {
                        $user->load('cuisinier');
                    } elseif ($user["ROLE"] = 'admin') {
                            $user->load('admin');
                        } else {
                            $user->load('distributeur');
                        }
        });

        return $this->success($utilisateurs, '', 200);
    }

    public function getUser($id) {
        $user = Utilisateur::with('personne')->find($id);

        if(!$user) {
            return $this->error(null, 'Utilisateur non trouvé !', 404);
        }

        if($user["ROLE"] === "dieteticien") {
                    $user->load('dieteticien');
                } elseif ($user["ROLE"] === 'cuisinier') {
                        $user->load('cuisinier');
                    } else {
                            $user->load('distributeur');
                        }

        return $this->success($user, "", 200);
    }

    public function createUser(CreateUserRequest $request) {
        $validatedData = $request->validated();

        DB::beginTransaction();
        try {
            $personne = Personne::create([
                'NOM' => $validatedData['NOM'],
                'PRENOM' => $validatedData['PRENOM'],
            ]);

            $utilisateur = Utilisateur::create([
                'ID_PERSONNE' => $personne->ID_PERSONNE,
                'LOGIN' => $validatedData['LOGIN'],
                'PASSWORD' => Hash::make($validatedData['PASSWORD']),
                'ROLE' => $validatedData['ROLE'],
            ]);

            switch ($validatedData['ROLE']) {
                case 'dieteticien':
                    Dieteticien::create([
                        'ID_UTILISATEUR' => $utilisateur->ID_UTILISATEUR,
                        'NUM_LICENCE' => $validatedData['NUM_LICENCE']
                    ]);
                    break;
                case 'cuisinier':
                    Cuisinier::create([
                        'ID_UTILISATEUR' => $utilisateur->ID_UTILISATEUR,
                        'TYPE_CUISINE' => $validatedData['TYPE_CUISINE'],
                    ]);
                    break;
                case 'distributeur':
                    Distributeur::create([
                        'ID_UTILISATEUR' => $utilisateur->ID_UTILISATEUR,
                        'NUM_BADGE' => $validatedData['NUM_BADGE'],
                    ]);
                    break;
                default:
                    break;
            }

            DB::commit();

            if($validatedData["ROLE"] === "dieteticien") {
                    $utilisateur->load('dieteticien');
                } elseif ($validatedData["ROLE"] === 'cuisinier') {
                        $utilisateur->load('cuisinier');
                    } else {
                            $utilisateur->load('distributeur');
                        }       

            $utilisateur->load('personne');
            $utilisateur->makeHidden(['PASSWORD']);

            return $this->success(
                $utilisateur,
                "L'utilisateur " . $utilisateur->personne->NOM . " " . $utilisateur->personne->PRENOM . " est crée avec succès !",
                201
            );

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error(
                $e,
                "Problème lors de la création de l'utilisateur !",
                500
            );
        }
    }


    public function updateUser(UpdateUserRequest $request, $userId) {
        $validatedData = $request->validated();

        DB::beginTransaction();
        try {
            $user_found = Utilisateur::find($userId);
            
            if(!$user_found) {
                return $this->error(null, "Utilisateur non trouvé !", 404);
            }

            $role = $user_found->ROLE;

            $user = Utilisateur::with('personne', $role)->find($userId);


            $user->personne->update([
                'NOM' => $validatedData['NOM'],
                'PRENOM' => $validatedData['PRENOM'],
                'DATE_NAISSANCE' => $validatedData['DATE_NAISSANCE'],
                'TELEPHONE' => $validatedData['TELEPHONE'],
                'GENRE' => $validatedData['GENRE'],
                'EMAIL' => $validatedData['EMAIL'],

            ]);

            $user->update([
                'LOGIN' => $validatedData['LOGIN'],
                'PASSWORD' => Hash::make($validatedData['PASSWORD']),
                'ROLE' => $validatedData['ROLE'],
            ]);

            switch ($role) {
                case 'dieteticien':
                    $user->dieteticien->update([
                        'NUM_LICENCE' => $validatedData['NUM_LICENCE']
                    ]);
                    break;
                case 'cuisinier':
                    $user->cuisinier->update([
                        'TYPE_CUISINE' => $validatedData['TYPE_CUISINE'],
                    ]);
                    break;
                case 'distributeur':
                    $user->distributeur->update([
                        'NUM_BADGE' => $validatedData['NUM_BADGE'],
                    ]);
                    break;
                default:
                    break;
            }

            DB::commit();

            return $this->success(
                $user,
                "L'utilisateur " . $user_found->personne->NOM . " " . $user_found->personne->PRENOM . " est modifié avec succès !",
                201
            );

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error(
                $e,
                "Problème lors de la modification de l'utilisateur !",
                500
            );
        }
    }

    public function deleteUser($userId) {
        $user = Utilisateur::with('personne')->find($userId);

        if(!$user) {
            return $this->error(null, "Utilisateur non trouvé !", 404);
        }

        $user->personne->delete();

        return $this->success(null, 'Utilisateur supprimé avec succès !', 200);
    }

    public function deleteUsers() {
        $users = Utilisateur::with('personne')->get();

        $users->each(function($user){ 
            if ($user["ROLE"] !== 'admin') {
                $user->personne->delete();
            }
        });

        return $this->success(null, 'Utilisateurs supprimés avec succès !', 200);
    }
}
