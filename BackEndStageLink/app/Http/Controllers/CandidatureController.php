<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use App\Models\OffreStage;
use App\Models\ProfilEtudiant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class CandidatureController extends Controller
{
    public function index()
    {
        $candidatures = Candidature::with(['offreStage.entreprise', 'etudiant'])->paginate(10);
        return response()->json($candidatures);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'offre_stage_id' => 'required|exists:offres_stage,id_offre_stage',
            'etudiant_id' => 'required|exists:profils_etudiants,id_etudiant',
            'cv_path' => 'required|file|mimes:pdf,doc,docx|max:2048',
            'lettre_motivation_path' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'message_motivation' => 'nullable|string|max:1000',
            'statut' => 'nullable|in:en_attente,acceptee,refusee,annulee'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Vérifier si l'étudiant a déjà postulé à cette offre
        $existingCandidature = Candidature::where('id_offre_stage', $request->offre_stage_id)
            ->where('id_etudiant', $request->etudiant_id)
            ->first();

        if ($existingCandidature) {
            return response()->json([
                'message' => 'Vous avez déjà postulé à cette offre de stage'
            ], 409);
        }

        // Vérification explicite du profil étudiant
        $profil = ProfilEtudiant::find($request->etudiant_id);
        if (!$profil) {
            return response()->json([
                'message' => 'Vous devez créer un profil étudiant pour postuler à une offre.'
            ], 403);
        }

        $data = $request->all();
        $data['statut'] = $data['statut'] ?? 'en_attente';
        
        // Map the frontend field names to database column names
        $data['id_offre_stage'] = $data['offre_stage_id'];
        $data['id_etudiant'] = $data['etudiant_id'];
        unset($data['offre_stage_id'], $data['etudiant_id']);

        // Gestion des fichiers uploadés
        if ($request->hasFile('cv_path')) {
            $cvPath = $request->file('cv_path')->store('candidatures/cv', 'public');
            $data['cv_path'] = $cvPath;
        }

        if ($request->hasFile('lettre_motivation_path')) {
            $lettrePath = $request->file('lettre_motivation_path')->store('candidatures/lettres', 'public');
            $data['lettre_motivation_path'] = $lettrePath;
        }

        $candidature = Candidature::create($data);
        $candidature->load(['offreStage.entreprise', 'etudiant']);

        return response()->json([
            'message' => 'Candidature soumise avec succès',
            'candidature' => $candidature
        ], 201);
    }

    public function show($id)
    {
        $candidature = Candidature::with(['offreStage.entreprise', 'etudiant'])->findOrFail($id);
        return response()->json($candidature);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'statut' => 'required|in:en_attente,acceptee,refusee,annulee',
            'message_reponse' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $candidature = Candidature::findOrFail($id);
        $candidature->update($request->all());
        $candidature->load(['offreStage.entreprise', 'etudiant']);

        return response()->json([
            'message' => 'Statut de la candidature mis à jour',
            'candidature' => $candidature
        ]);
    }

    public function destroy($id)
    {
        $candidature = Candidature::findOrFail($id);
        
        // Supprimer les fichiers associés
        if ($candidature->cv_path) {
            Storage::disk('public')->delete($candidature->cv_path);
        }
        if ($candidature->lettre_motivation_path) {
            Storage::disk('public')->delete($candidature->lettre_motivation_path);
        }

        $candidature->delete();
        return response()->json(['message' => 'Candidature supprimée'], 200);
    }

    // Méthodes spécifiques
    public function getCandidaturesByOffre($offreId)
    {
        $candidatures = Candidature::with(['etudiant.utilisateur'])
            ->where('id_offre_stage', $offreId)
            ->orderByDesc('created_at')
            ->get();
        return response()->json($candidatures);
    }

    public function getCandidaturesByEtudiant($etudiantId)
    {
        $candidatures = Candidature::with(['offreStage.entreprise'])
            ->where('id_etudiant', $etudiantId)
            ->paginate(10);
        return response()->json($candidatures);
    }

    public function postuler(Request $request)
    {
        return $this->store($request);
    }
}
