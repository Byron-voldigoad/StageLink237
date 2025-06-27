<?php

namespace App\Http\Controllers;

use App\Models\SoumissionEtudiant;
use Illuminate\Http\Request;

class SoumissionEtudiantController extends Controller
{
    public function index()
    {
        return response()->json(SoumissionEtudiant::all());
    }

    public function store(Request $request)
    {
        $soumission = SoumissionEtudiant::create($request->all());
        return response()->json($soumission, 201);
    }

    public function show($id)
    {
        return response()->json(SoumissionEtudiant::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $soumission = SoumissionEtudiant::findOrFail($id);
        $soumission->update($request->all());
        return response()->json($soumission);
    }

    public function destroy($id)
    {
        SoumissionEtudiant::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
