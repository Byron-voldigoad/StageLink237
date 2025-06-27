<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use App\Models\OffreStage;
use App\Models\ProfilEtudiant;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function getStats()
    {
        try {
            $stats = [
                'entreprises' => Entreprise::count(),
                'stages' => OffreStage::count(),
                'etudiants' => ProfilEtudiant::count(),
                'messages' => Message::count()
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des statistiques',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getEntreprisesByQuartier()
    {
        try {
            $entreprises = Entreprise::select('adresse')
                ->get()
                ->groupBy(function($item) {
                    // Extraire le quartier de l'adresse (pour l'exemple, on prend le premier mot)
                    $parts = explode(' ', $item->adresse);
                    return $parts[0];
                })
                ->map(function($group) {
                    return [
                        'nombre' => $group->count(),
                        'exemples' => $group->take(2)->pluck('nom')->implode(', ')
                    ];
                });

            return response()->json($entreprises);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des entreprises par quartier',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getRecentEntreprises()
    {
        try {
            $entreprises = Entreprise::latest()
                ->take(5)
                ->get(['nom', 'adresse', 'created_at']);

            return response()->json($entreprises);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des entreprises récentes',
                'message' => $e->getMessage()
            ], 500);
        }
    }
} 