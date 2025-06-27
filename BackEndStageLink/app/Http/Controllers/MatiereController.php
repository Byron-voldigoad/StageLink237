<?php

namespace App\Http\Controllers;

use App\Models\Matiere;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MatiereController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $matieres = Matiere::all();
            return response()->json($matieres);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des matières',
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
                'description' => 'nullable|string',
                'code' => 'nullable|string|max:50'
            ]);

            $matiere = Matiere::create($request->all());

            return response()->json([
                'success' => true,
                'data' => $matiere,
                'message' => 'Matière créée avec succès'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la matière',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Matiere $matiere): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $matiere
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la matière',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Matiere $matiere): JsonResponse
    {
        try {
            $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'nullable|string',
                'code' => 'nullable|string|max:50'
            ]);

            $matiere->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $matiere,
                'message' => 'Matière mise à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la matière',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Matiere $matiere): JsonResponse
    {
        try {
            $matiere->delete();

            return response()->json([
                'success' => true,
                'message' => 'Matière supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la matière',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
