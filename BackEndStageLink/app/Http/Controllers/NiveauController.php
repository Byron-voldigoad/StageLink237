<?php

namespace App\Http\Controllers;

use App\Models\Niveau;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NiveauController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $niveaux = Niveau::all();
            return response()->json([
                'success' => true,
                'data' => $niveaux
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des niveaux',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'nullable|string'
            ]);

            $niveau = Niveau::create($request->all());

            return response()->json([
                'success' => true,
                'data' => $niveau,
                'message' => 'Niveau créé avec succès'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du niveau',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Niveau $niveau): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $niveau
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du niveau',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Niveau $niveau): JsonResponse
    {
        try {
            $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'nullable|string'
            ]);

            $niveau->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $niveau,
                'message' => 'Niveau mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du niveau',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Niveau $niveau): JsonResponse
    {
        try {
            $niveau->delete();

            return response()->json([
                'success' => true,
                'message' => 'Niveau supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du niveau',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
