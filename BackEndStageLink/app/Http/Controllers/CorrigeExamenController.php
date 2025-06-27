<?php

namespace App\Http\Controllers;

use App\Models\CorrigeExamen;
use Illuminate\Http\Request;

class CorrigeExamenController extends Controller
{
    public function index()
    {
        return response()->json(CorrigeExamen::all());
    }

    public function store(Request $request)
    {
        $corrige = CorrigeExamen::create($request->all());
        return response()->json($corrige, 201);
    }

    public function show($id)
    {
        return response()->json(CorrigeExamen::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $corrige = CorrigeExamen::findOrFail($id);
        $corrige->update($request->all());
        return response()->json($corrige);
    }

    public function destroy($id)
    {
        CorrigeExamen::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
