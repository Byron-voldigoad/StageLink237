<?php

namespace App\Http\Controllers;

use App\Models\ProfilEtudiant;
use Illuminate\Http\Request;

class EtudiantController extends Controller
{
    public function index()
    {
        return ProfilEtudiant::with('utilisateur')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:utilisateurs',
            'password' => 'required|min:8',
            'prenom' => 'required',
            'nom' => 'required',
            'niveau' => 'required',
            'domaine_etude' => 'required'
        ]);

        $utilisateur = \App\Models\Utilisateur::create([
            'email' => $validated['email'],
            'password' => bcrypt($validated['password'])
        ]);

        $utilisateur->roles()->attach(\App\Models\Role::where('nom_role', 'etudiant')->first()->id_role);

        $etudiant = \App\Models\ProfilEtudiant::create([
            'id_utilisateur' => $utilisateur->id_utilisateur,
            'prenom' => $validated['prenom'],
            'nom' => $validated['nom'],
            'niveau' => $validated['niveau'],
            'domaine_etude' => $validated['domaine_etude']
        ]);

        return response()->json($etudiant->load('utilisateur'), 201);
    }

    public function show($id)
    {
        return ProfilEtudiant::with('utilisateur')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $etudiant = ProfilEtudiant::findOrFail($id);
        $validated = $request->validate([
            'prenom' => 'sometimes|required',
            'nom' => 'sometimes|required',
            'telephone' => 'nullable',
            'adresse' => 'nullable',
            'ecole' => 'nullable',
            'niveau' => 'sometimes|required',
            'domaine_etude' => 'sometimes|required',
            'cv_path' => 'nullable',
            'photo_profil' => 'nullable'
        ]);

        $etudiant->update($validated);
        return response()->json($etudiant);
    }

    public function destroy($id)
    {
        $etudiant = ProfilEtudiant::findOrFail($id);
        $etudiant->utilisateur()->delete();
        return response()->json(null, 204);
    }
}