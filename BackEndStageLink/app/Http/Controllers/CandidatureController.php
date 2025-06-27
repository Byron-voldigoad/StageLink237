<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use Illuminate\Http\Request;

class CandidatureController extends Controller
{
    public function index()
    {
        return response()->json(Candidature::all());
    }

    public function store(Request $request)
    {
        $candidature = Candidature::create($request->all());
        return response()->json($candidature, 201);
    }

    public function show($id)
    {
        return response()->json(Candidature::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $candidature = Candidature::findOrFail($id);
        $candidature->update($request->all());
        return response()->json($candidature);
    }

    public function destroy($id)
    {
        Candidature::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
