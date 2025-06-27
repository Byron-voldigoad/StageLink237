<?php

namespace App\Http\Controllers;

use App\Models\SujetExamen;
use Illuminate\Http\Request;

class SujetExamenController extends Controller
{
    public function index()
    {
        $sujets = SujetExamen::with(['matiere', 'niveau', 'anneeAcademique', 'typeSujet'])->get();
        return response()->json($sujets);
    }

    public function store(Request $request)
    {
        // Validation minimale pour éviter undefined
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'id_matiere' => 'required|integer|exists:matieres,id_matiere',
            'id_niveau' => 'required|integer|exists:niveaux,id_niveau',
            'id_annee' => 'required|integer|exists:annees_academiques,id_annee',
            'est_gratuit' => 'required|boolean',
            'fichier' => 'nullable|file|mimes:pdf,doc,docx,zip',
        ]);

        $data = $request->except('fichier');

        if ($request->hasFile('fichier')) {
            $path = $request->file('fichier')->store('docs', 'public');
            $data['fichier_path'] = $path;
        } else {
            $data['fichier_path'] = null;
        }

        $sujet = SujetExamen::create($data);
        return response()->json($sujet, 201);
    }

    public function show($id)
    {
        return response()->json(SujetExamen::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $sujet = SujetExamen::findOrFail($id);
        $sujet->update($request->all());
        return response()->json($sujet);
    }

    public function destroy($id)
    {
        SujetExamen::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
