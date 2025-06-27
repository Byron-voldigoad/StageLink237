<?php

namespace App\Http\Controllers;

use App\Models\TuteurMatiere;
use Illuminate\Http\Request;

class TuteurMatiereController extends Controller
{
    public function index()
    {
        return response()->json(TuteurMatiere::all());
    }

    public function store(Request $request)
    {
        $tm = TuteurMatiere::create($request->all());
        return response()->json($tm, 201);
    }

    public function show($id)
    {
        return response()->json(TuteurMatiere::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $tm = TuteurMatiere::findOrFail($id);
        $tm->update($request->all());
        return response()->json($tm);
    }

    public function destroy($id)
    {
        TuteurMatiere::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
