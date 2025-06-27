<?php

namespace App\Http\Controllers;

use App\Models\EvaluationTuteur;
use Illuminate\Http\Request;

class EvaluationTuteurController extends Controller
{
    public function index()
    {
        return response()->json(EvaluationTuteur::all());
    }

    public function store(Request $request)
    {
        $evaluation = EvaluationTuteur::create($request->all());
        return response()->json($evaluation, 201);
    }

    public function show($id)
    {
        return response()->json(EvaluationTuteur::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $evaluation = EvaluationTuteur::findOrFail($id);
        $evaluation->update($request->all());
        return response()->json($evaluation);
    }

    public function destroy($id)
    {
        EvaluationTuteur::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
