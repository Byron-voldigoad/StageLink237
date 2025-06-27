<?php

namespace App\Http\Controllers;

use App\Models\TypeSujet;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TypeSujetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $types = TypeSujet::all();
            return response()->json([
                'success' => true,
                'data' => $types
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des types de sujets',
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

            $type = TypeSujet::create($request->all());

            return response()->json([
                'success' => true,
                'data' => $type,
                'message' => 'Type de sujet créé avec succès'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du type de sujet',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(TypeSujet $typeSujet): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $typeSujet
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du type de sujet',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TypeSujet $typeSujet): JsonResponse
    {
        try {
            $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'nullable|string'
            ]);

            $typeSujet->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $typeSujet,
                'message' => 'Type de sujet mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du type de sujet',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TypeSujet $typeSujet): JsonResponse
    {
        try {
            $typeSujet->delete();

            return response()->json([
                'success' => true,
                'message' => 'Type de sujet supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du type de sujet',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 