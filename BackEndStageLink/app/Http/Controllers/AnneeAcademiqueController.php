<?php

namespace App\Http\Controllers;

use App\Models\AnneeAcademique;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AnneeAcademiqueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $annees = AnneeAcademique::all();
            return response()->json([
                'success' => true,
                'data' => $annees
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des années académiques',
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
                'annee_debut' => 'required|integer|min:2000|max:2100',
                'annee_fin' => 'required|integer|min:2000|max:2100',
                'est_active' => 'boolean',
                'description' => 'nullable|string'
            ]);

            $annee = AnneeAcademique::create($request->all());

            return response()->json([
                'success' => true,
                'data' => $annee,
                'message' => 'Année académique créée avec succès'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'année académique',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(AnneeAcademique $anneeAcademique): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $anneeAcademique
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de l\'année académique',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AnneeAcademique $anneeAcademique): JsonResponse
    {
        try {
            $request->validate([
                'annee_debut' => 'required|integer|min:2000|max:2100',
                'annee_fin' => 'required|integer|min:2000|max:2100',
                'est_active' => 'boolean',
                'description' => 'nullable|string'
            ]);

            $anneeAcademique->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $anneeAcademique,
                'message' => 'Année académique mise à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de l\'année académique',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AnneeAcademique $anneeAcademique): JsonResponse
    {
        try {
            $anneeAcademique->delete();

            return response()->json([
                'success' => true,
                'message' => 'Année académique supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de l\'année académique',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the current active academic year.
     */
    public function getCurrent(): JsonResponse
    {
        try {
            $currentYear = AnneeAcademique::where('est_active', true)->first();
            
            if (!$currentYear) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucune année académique active trouvée'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $currentYear
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de l\'année académique active',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
