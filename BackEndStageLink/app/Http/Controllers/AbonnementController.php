<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AbonnementController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $user = auth()->user();
        
        return response()->json([
            'abonne' => $user->profilEtudiant && $user->profilEtudiant->credits > 0,
            'credits' => $user->profilEtudiant ? $user->profilEtudiant->credits : 0
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'montant' => 'required|numeric|min:0'
        ]);

        $user = auth()->user();
        
        if (!$user->profilEtudiant) {
            return response()->json(['message' => 'Réservé aux étudiants'], 403);
        }

        $user->profilEtudiant->increment('credits', $validated['montant']);

        \App\Models\TransactionCredit::create([
            'id_utilisateur' => $user->id,
            'montant' => $validated['montant'],
            'type' => 'achat',
            'statut' => 'complete'
        ]);

        return response()->json([
            'message' => 'Crédits ajoutés avec succès',
            'credits' => $user->profilEtudiant->credits
        ], 201);
    }
}