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
        // Retourne les utilisateurs avec leurs rôles (sans profils)
        return Utilisateur::with('roles')->get();
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
        try {
            $user = Utilisateur::findOrFail($id);

            // Debug: Afficher les informations de la requête
            \Log::info('=== DÉBUT DE LA REQUÊTE ===');
            \Log::info('Méthode: ' . $request->method());
            \Log::info('URL: ' . $request->fullUrl());
            \Log::info('Headers:', $request->headers->all());
            \Log::info('Contenu brut: ' . $request->getContent());
            \Log::info('Tous les champs: ', $request->all());
            \Log::info('Fichiers reçus: ', $request->allFiles());
            \Log::info('Est une requête JSON: ' . ($request->isJson() ? 'Oui' : 'Non'));
            \Log::info('Content-Type: ' . $request->header('Content-Type'));
            \Log::info('Est une requête multipart: ' . (str_contains($request->header('Content-Type'), 'multipart/form-data') ? 'Oui' : 'Non'));

            // Vérifier si le fichier est présent dans la requête
            $file = $request->file('photo');
            if ($file) {
                \Log::info('Fichier photo détecté:', [
                    'name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime' => $file->getMimeType(),
                    'extension' => $file->getClientOriginalExtension(),
                    'isValid' => $file->isValid(),
                    'error' => $file->getError()
                ]);
            } else {
                \Log::warning('Aucun fichier photo détecté dans la requête');
            }

            // Validation des champs
            $validated = $request->validate([
                'email' => 'sometimes|email|unique:utilisateurs,email,'.$user->id_utilisateur.',id_utilisateur',
                'password' => 'sometimes|min:8',
                'nom' => 'sometimes|string|max:100',
                'prenom' => 'sometimes|string|max:100',
                'telephone' => 'nullable|string|max:20',
                'photo' => 'sometimes|file|image|max:2048' // 2MB max
            ]);

            // Gestion du mot de passe
            if (isset($validated['password'])) {
                $validated['mot_de_passe'] = bcrypt($validated['password']);
                unset($validated['password']);
            }

            // Gestion de l'upload de la photo de profil
            $data = $request->except('photo');

            if ($request->hasFile('photo')) {
                // Créer le répertoire s'il n'existe pas
                $storagePath = 'public/photos';
                $fullStoragePath = storage_path('app/' . $storagePath);
                
                if (!file_exists($fullStoragePath)) {
                    mkdir($fullStoragePath, 0777, true);
                }
                
                // Supprimer l'ancienne photo si elle existe
                if ($user->photo) {
                    $oldPhotoPath = storage_path('app/public/' . $user->photo);
                    if (file_exists($oldPhotoPath) && is_file($oldPhotoPath)) {
                        unlink($oldPhotoPath);
                    }
                }
                
                // Générer un nom de fichier unique
                $fileName = time() . '_' . uniqid() . '.' . $request->file('photo')->getClientOriginalExtension();
                
                // Stocker le fichier
                $path = $request->file('photo')->storeAs($storagePath, $fileName);
                
                // Enregistrer le chemin relatif dans la base de données
                $relativePath = str_replace('public/', '', $path);
                $data['photo'] = $relativePath;
                
                \Log::info('Photo stockée avec succès', [
                    'relativePath' => $relativePath,
                    'storagePath' => $path,
                    'publicUrl' => asset('storage/' . $relativePath),
                    'fileExists' => file_exists(storage_path('app/' . $path))
                ]);
            }

            // Mettre à jour les champs validés
            $user->update($validated);

            // Mettre à jour la photo si elle a été modifiée
            if (isset($data['photo'])) {
                $user->photo = $data['photo'];
                $user->save();
            }

            // Recharger l'utilisateur avec ses relations et les attributs calculés
            $user = $user->fresh(['roles']);
            
            // Inclure l'URL complète de la photo dans la réponse
            $responseData = $user->toArray();
            $responseData['photo_url'] = $user->photo_url;
            
            return response()->json([
                'success' => true,
                'data' => $responseData
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la mise à jour du profil: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du profil',
                'error' => $e->getMessage()
            ], 500);
        }
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