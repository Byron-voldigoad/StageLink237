<?php

namespace App\Http\Controllers;

use App\Models\Langue;
use Illuminate\Http\JsonResponse;

class LangueController extends Controller
{
    /**
     * Retourner la liste des langues disponibles
     */
    public function index(): JsonResponse
    {
        $langues = Langue::all();
        return response()->json($langues);
    }
}
