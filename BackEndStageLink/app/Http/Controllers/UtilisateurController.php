<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
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
        $validated = $request->validate([
            'email' => 'required|email|unique:utilisateurs',
            'password' => 'required|min:8',
            'role' => 'required|in:admin,etudiant,tuteur,entreprise'
        ]);

        $user = Utilisateur::create([
            'email' => $validated['email'],
            'password' => bcrypt($validated['password'])
        ]);

        // Assigner le rôle
        $role = \App\Models\Role::where('nom', $validated['role'])->first();
        if ($role) {
            $user->roles()->attach($role);
        }

        return response()->json($user->load('roles'), 201);
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