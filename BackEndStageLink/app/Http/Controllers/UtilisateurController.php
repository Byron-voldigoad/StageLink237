<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Models\ProfilTuteur;
use Illuminate\Http\Request;

class UtilisateurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Utilisateur::with(['roles', 'profilEtudiant', 'profilTuteur', 'entreprise'])->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $data = $request->all();
            \Log::info('Données reçues pour inscription utilisateur', $data);
            $validated = validator($data, [
            'email' => 'required|email|unique:utilisateurs',
                'password' => 'required|string|min:8',
                'nom' => 'required|string|max:100',
                'prenom' => 'required|string|max:100',
            'role' => 'required|in:admin,etudiant,tuteur,entreprise'
            ])->validate();

        $user = Utilisateur::create([
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
            'email' => $validated['email'],
                'mot_de_passe' => bcrypt($validated['password'])
        ]);

        // Assigner le rôle
            $role = \App\Models\Role::where('nom_role', $validated['role'])->first();
        if ($role) {
                $user->roles()->attach($role, ['created_at' => now(), 'updated_at' => now()]);
            }

            // Si tuteur, gérer l'upload du justificatif et créer le profil tuteur
            if ($validated['role'] === 'tuteur') {
                $diplomePath = null;
                if ($request->hasFile('justificatif')) {
                    $diplomePath = $request->file('justificatif')->store('justificatifs', 'public');
                }
                ProfilTuteur::create([
                    'utilisateur_id' => $user->id_utilisateur,
                    'diplomes' => $diplomePath,
                ]);
        }

        return response()->json($user->load('roles'), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors(), 'message' => 'Validation failed', 'debug' => $data], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage(), 'debug' => $data], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Utilisateur::with(['roles', 'profilEtudiant', 'profilTuteur', 'entreprise'])->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = Utilisateur::findOrFail($id);

        $validated = $request->validate([
            'email' => 'sometimes|email|unique:utilisateurs,email,'.$user->id,
            'password' => 'sometimes|min:8'
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        $user->update($validated);

        return response()->json($user->load('roles'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = Utilisateur::findOrFail($id);
        $user->delete();

        return response()->json(null, 204);
    }
}