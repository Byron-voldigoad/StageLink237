<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        // Retourne tous les messages sans authentification
        return response()->json(Message::with(['expediteur', 'destinataire'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_expediteur' => 'required|exists:utilisateurs,id_utilisateur',
            'id_destinataire' => 'required|exists:utilisateurs,id_utilisateur',
            'contenu' => 'required|string'
        ]);

        $message = Message::create([
            'id_expediteur' => $validated['id_expediteur'],
            'id_destinataire' => $validated['id_destinataire'],
            'contenu' => $validated['contenu']
        ]);

        return response()->json($message->load(['expediteur', 'destinataire']), 201);
    }

    public function show($id)
    {
        return response()->json(Message::with(['expediteur', 'destinataire'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $message = Message::findOrFail($id);
        $validated = $request->validate([
            'contenu' => 'required|string'
        ]);
        $message->update($validated);
        return response()->json($message);
    }

    public function destroy($id)
    {
        Message::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}