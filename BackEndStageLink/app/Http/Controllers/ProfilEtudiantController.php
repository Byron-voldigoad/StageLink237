<?php

namespace App\Http\Controllers;

use App\Models\ProfilEtudiant;
use Illuminate\Http\Request;

class ProfilEtudiantController extends Controller
{
    public function index()
    {
        return response()->json(ProfilEtudiant::all());
    }

    public function store(Request $request)
    {
        $etudiant = ProfilEtudiant::create($request->all());
        return response()->json($etudiant, 201);
    }

    public function show($id)
    {
        return response()->json(ProfilEtudiant::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $etudiant = ProfilEtudiant::findOrFail($id);
        $etudiant->update($request->all());
        return response()->json($etudiant);
    }

    public function destroy($id)
    {
        ProfilEtudiant::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
