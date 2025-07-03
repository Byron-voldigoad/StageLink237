<?php

namespace App\Http\Controllers;

use App\Models\OffreStage;
use App\Services\CompetencesService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OffreStageController extends Controller
{
    public function index(Request $request)
    {
        $offres = OffreStage::with('entreprise')->paginate(6);
        return response()->json($offres);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_entreprise' => 'required|exists:entreprises,id_entreprise',
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'exigences' => 'nullable|string',
            'competences_requises' => 'nullable|string',
            'duree' => 'nullable|string',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date',
            'localisation' => 'nullable|string|max:255',
            'remuneration' => 'nullable|numeric|min:0',
            'secteur_id' => 'required|exists:secteurs,id',
            'statut' => 'required|in:ouvert,ferme,en_attente'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        if (empty($data['competences_requises']) && !empty($data['secteur_id'])) {
            $secteur = \App\Models\Secteur::find($data['secteur_id']);
            if ($secteur) {
                $competences = CompetencesService::getCompetencesParSecteur($secteur->nom);
                $data['competences_requises'] = implode("\n", $competences);
            }
        }

        $offre = OffreStage::create($data);
        $offre->load('entreprise');
        
        return response()->json($offre, 201);
    }

    public function show($id)
    {
        $offre = OffreStage::with('entreprise')->findOrFail($id);
        return response()->json($offre);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'id_entreprise' => 'sometimes|required|exists:entreprises,id_entreprise',
            'titre' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'exigences' => 'nullable|string',
            'competences_requises' => 'nullable|string',
            'duree' => 'nullable|string',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date',
            'localisation' => 'nullable|string|max:255',
            'remuneration' => 'nullable|numeric|min:0',
            'secteur_id' => 'sometimes|required|exists:secteurs,id',
            'statut' => 'sometimes|required|in:ouvert,ferme,en_attente'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $offre = OffreStage::findOrFail($id);
        $data = $request->all();

        if (isset($data['secteur_id']) && (empty($data['competences_requises']) || !isset($data['competences_requises']))) {
            $secteur = \App\Models\Secteur::find($data['secteur_id']);
            if ($secteur) {
                $competences = CompetencesService::getCompetencesParSecteur($secteur->nom);
                $data['competences_requises'] = implode("\n", $competences);
            }
        }

        $offre->update($data);
        $offre->load('entreprise');

        return response()->json($offre);
    }

    public function destroy($id)
    {
        $offre = OffreStage::findOrFail($id);
        $offre->delete();
        return response()->json(null, 204);
    }
}
