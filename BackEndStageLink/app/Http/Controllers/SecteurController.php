<?php

namespace App\Http\Controllers;

use App\Models\Secteur;
use Illuminate\Http\Request;

class SecteurController extends Controller
{
    public function index()
    {
        return response()->json(Secteur::all());
    }
} 