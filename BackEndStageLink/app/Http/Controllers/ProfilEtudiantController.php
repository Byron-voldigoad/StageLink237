<?php

namespace App\Http\Controllers;

use App\Models\ProfilEtudiant;
use Illuminate\Http\Request;

class ProfilEtudiantController extends Controller
{
    public function index()
    {
        return response()->json(ProfilEtudiant::all());
    }

    public function store(Request $request)
    {
        $etudiant = ProfilEtudiant::create($request->all());
        return response()->json($etudiant, 201);
    }

    public function show($id)
    {
        return response()->json(ProfilEtudiant::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $etudiant = ProfilEtudiant::findOrFail($id);

        // Gestion de l'upload du CV
        if ($request->hasFile('cv')) {
            $file = $request->file('cv');
            $filename = uniqid() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('candidatures/cv', $filename, 'public');
            $etudiant->cv_path = $path;
        }

        $etudiant->fill($request->except('cv'));
        $etudiant->save();

        return response()->json($etudiant);
    }

    public function destroy($id)
    {
        ProfilEtudiant::findOrFail($id)->delete();
        return response()->json(null, 204);
    }

    /**
     * Récupère le profil étudiant par ID utilisateur
     *
     * @param int $id ID de l'utilisateur
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByUtilisateurId($id)
    {
        $profilEtudiant = ProfilEtudiant::where('utilisateur_id', $id)->first();
        
        if (!$profilEtudiant) {
            return response()->json([
                'success' => false,
                'message' => 'Profil étudiant non trouvé pour cet utilisateur'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $profilEtudiant
        ]);
    }
}
