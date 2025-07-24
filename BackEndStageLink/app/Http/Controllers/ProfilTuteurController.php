<?php

namespace App\Http\Controllers;

use App\Models\ProfilTuteur;
use Illuminate\Http\Request;

class ProfilTuteurController extends Controller
{
    public function index()
    {
        return response()->json(ProfilTuteur::all());
    }

    public function store(Request $request)
    {
        $tuteur = ProfilTuteur::create($request->all());
        return response()->json($tuteur, 201);
    }

    public function show($id)
    {
        return response()->json(ProfilTuteur::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $tuteur = ProfilTuteur::findOrFail($id);
        $tuteur->update($request->all());
        return response()->json($tuteur);
    }

    public function destroy($id)
    {
        ProfilTuteur::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
    
    /**
     * Récupère le profil tuteur par ID utilisateur
     *
     * @param int $id ID de l'utilisateur
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByUtilisateurId($id)
    {
        $profilTuteur = ProfilTuteur::where('utilisateur_id', $id)->first();
        
        if (!$profilTuteur) {
            return response()->json([
                'success' => false,
                'message' => 'Profil tuteur non trouvé pour cet utilisateur'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $profilTuteur
        ]);
    }
}
