<?php

namespace App\Http\Controllers;

use App\Models\TransactionCredit;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        return TransactionCredit::where('id_utilisateur', auth()->id())
                              ->orderBy('created_at', 'desc')
                              ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'montant' => 'required|numeric|min:0',
            'methode_paiement' => 'required|string',
            'reference_transaction' => 'required|string'
        ]);

        $transaction = TransactionCredit::create([
            'id_utilisateur' => auth()->id(),
            'montant' => $validated['montant'],
            'type' => 'achat',
            'methode_paiement' => $validated['methode_paiement'],
            'reference_transaction' => $validated['reference_transaction'],
            'statut' => 'en_attente'
        ]);

        return response()->json($transaction, 201);
    }

    public function show($id)
    {
        $transaction = TransactionCredit::findOrFail($id);
        
        if ($transaction->id_utilisateur != auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        return $transaction;
    }

    public function confirmPayment($id)
    {
        $transaction = TransactionCredit::findOrFail($id);
        
        if ($transaction->id_utilisateur != auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        if ($transaction->statut != 'en_attente') {
            return response()->json(['message' => 'Transaction déjà traitée'], 400);
        }

        $transaction->update(['statut' => 'complete']);

        // Add credits to user
        $user = auth()->user();
        if ($user->profilEtudiant) {
            $user->profilEtudiant->increment('credits', $transaction->montant);
        }

        return response()->json($transaction);
    }
}