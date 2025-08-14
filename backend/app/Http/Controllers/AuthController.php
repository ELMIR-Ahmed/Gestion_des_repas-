<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\CreateUserRequest;
use App\Models\Personne;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use App\Trait\HttpResponses;
use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\HasApiTokens;

class AuthController extends Controller
{
    use HttpResponses, HasApiTokens;

    // public function login(LoginRequest $request) {
    //     $credentials = $request->validated();


    //     if(!Auth::attempt($credentials)) {
    //         return $this->error("", "Identifiants incorrects !", 401);
    //     }

    //     $user = Utilisateur::where('login', $credentials["login"])->first();

    //     return $this->success(
    //         [
    //             'user' => $user,
    //             'token' => $user->createToken("Api token for " . $user->personne->nom)->plainTextToken
    //         ],
    //         "Authentication was succesful !"
    //     );
    // }


    public function login(LoginRequest $request) {
        $validatedData = $request->validated();

        // 1. Récupérer l'utilisateur via Eloquent (pour avoir un objet modèle)
        // Utilisez la colonne 'LOGIN' en majuscules pour la recherche
        $user = Utilisateur::where('LOGIN', $validatedData['LOGIN'])->first();

        // 2. Vérifier si l'utilisateur a été trouvé
        if (!$user) {
            return $this->error("", "Identifiants incorrects !", 401);
        }

        $hashedPasswordFromModel = $user->PASSWORD;

        $checkResult = Hash::check($validatedData['PASSWORD'], $hashedPasswordFromModel);

        if (!$checkResult) {
            return $this->error("", "Identifiants incorrects !", 401);
        }

        Auth::login($user); 

        $tokenName = "API Token pour " . ($user->personne->NOM ?? $user->LOGIN);
        $token = $user->createToken($tokenName)->plainTextToken;

        return $this->success(
            [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ],
            "Authentification réussie !"
        );
    }


    public function register(CreateUserRequest $request) {
        $validatedData = $request->validated();

        $personne = Personne::create([
            'nom' => $validatedData['nom'],
            'prenom' => $validatedData['prenom']
        ]);

        $user = Utilisateur::create([
            'login' => $validatedData['login'],
            'password' => Hash::make($validatedData['password']),
            'role' => $validatedData['role'],
            'id_personne' => $personne->id_personne
        ]);

        return $this->success(
            [ 'user' => $validatedData],
            "L'utilisateur " . $validatedData["nom"] . " " . $validatedData["prenom"] . " est crée avec succès !",
            201
        );
        
    }
}
