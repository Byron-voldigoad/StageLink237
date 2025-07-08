<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    // Login
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Vérifie l'utilisateur dans la table 'utilisateurs'
        $user = \App\Models\Utilisateur::where('email', $credentials['email'])->first();

        if (!$user || !\Hash::check($credentials['password'], $user->mot_de_passe)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        // Création du token Sanctum
        $token = $user->createToken('authToken')->plainTextToken;

        // On ne vérifie pas le profil étudiant, on renvoie juste l'utilisateur
        $etudiantId = null;
        if ($user->profilEtudiant) {
            $etudiantId = $user->profilEtudiant->id_etudiant;
        }

        return response()->json([
            'user' => $user,
            'token' => $token,
            'etudiant_id' => $etudiantId
        ]);
    }

    // Logout
    public function logout(Request $request)
    {
        // Supprime le token courant
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }
}

