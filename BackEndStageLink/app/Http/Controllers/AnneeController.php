<?php

namespace App\Http\Controllers;

use App\Models\AnneeAcademique;
use Illuminate\Http\Request;

class AnneeController extends Controller
{
    public function index()
    {
        return AnneeAcademique::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'annee_debut' => 'required|integer',
            'annee_fin' => 'required|integer|gt:annee_debut',
            'description' => 'nullable|string'
        ]);

        $annee = AnneeAcademique::create($validated);
        return response()->json($annee, 201);
    }

    public function show($id)
    {
        return AnneeAcademique::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $annee = AnneeAcademique::findOrFail($id);
        $validated = $request->validate([
            'annee_debut' => 'sometimes|required|integer',
            'annee_fin' => 'sometimes|required|integer|gt:annee_debut',
            'description' => 'nullable|string'
        ]);

        $annee->update($validated);
        return response()->json($annee);
    }

    public function destroy($id)
    {
        $annee = AnneeAcademique::findOrFail($id);
        $annee->delete();
        return response()->json(null, 204);
    }
}
