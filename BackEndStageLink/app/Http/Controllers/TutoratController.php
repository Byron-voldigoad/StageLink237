<?php

namespace App\Http\Controllers;

use App\Models\Tutorat;
use App\Models\CandidatureTutorat;
use App\Models\SeanceTutorat;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class TutoratController extends Controller
{
    /**
     * Afficher la liste des tutorats
     */
    public function index(Request $request): JsonResponse
    {
        $query = Tutorat::with(['tuteur.utilisateur', 'tuteur.matieres', 'tuteur.langues']);

        // Filtres
        if ($request->has('domaine')) {
            $query->where('domaine', $request->domaine);
        }

        if ($request->has('niveau')) {
            $query->where('niveau', $request->niveau);
        }

        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        if ($request->has('tuteur_id')) {
            $query->where('tuteur_id', $request->tuteur_id);
        }

        // Recherche par titre ou description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('titre', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('domaine', 'like', "%{$search}%");
            });
        }

        $tutorats = $query->orderBy('created_at', 'desc')->paginate(10);
        
        return response()->json($tutorats);
    }

    /**
     * Créer un nouveau tutorat
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'domaine' => 'required|string|max:100',
            'niveau' => 'required|string|max:50',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'tuteur_id' => 'required|exists:profils_tuteurs,id_tuteur',
            'localisation' => 'nullable|string|max:255',
            'tarif_horaire' => 'nullable|numeric|min:0',
            'duree_seance' => 'nullable|integer|min:15',
            'nombre_seances' => 'nullable|integer|min:1',
            'prerequis' => 'nullable|string',
            'objectifs' => 'nullable|string',
            'methode_pedagogique' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tutorat = Tutorat::create($request->all());
        $tutorat->load('tuteur.utilisateur');

        return response()->json($tutorat, 201);
    }

    /**
     * Afficher un tutorat spécifique
     */
    public function show($id): JsonResponse
    {
        $tutorat = Tutorat::with([
            'tuteur.utilisateur',
            'tuteur.matieres',
            'tuteur.langues',
            'candidatures.etudiant.utilisateur',
            'seances'
        ])->findOrFail($id);

        return response()->json($tutorat);
    }

    /**
     * Mettre à jour un tutorat
     */
    public function update(Request $request, $id): JsonResponse
    {
        $tutorat = Tutorat::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'titre' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'domaine' => 'sometimes|required|string|max:100',
            'niveau' => 'sometimes|required|string|max:50',
            'date_debut' => 'sometimes|required|date',
            'date_fin' => 'sometimes|required|date|after:date_debut',
            'localisation' => 'nullable|string|max:255',
            'statut' => 'sometimes|required|in:ouverte,pourvue,cloturee',
            'tarif_horaire' => 'nullable|numeric|min:0',
            'duree_seance' => 'nullable|integer|min:15',
            'nombre_seances' => 'nullable|integer|min:1',
            'prerequis' => 'nullable|string',
            'objectifs' => 'nullable|string',
            'methode_pedagogique' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tutorat->update($request->all());
        $tutorat->load('tuteur.utilisateur');

        return response()->json($tutorat);
    }

    /**
     * Supprimer un tutorat
     */
    public function destroy($id): JsonResponse
    {
        $tutorat = Tutorat::findOrFail($id);
        $tutorat->delete();

        return response()->json(null, 204);
    }

    /**
     * Postuler à un tutorat
     */
    public function postuler(Request $request, $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'etudiant_id' => 'required|exists:profils_etudiants,id_etudiant',
            'message_motivation' => 'nullable|string',
            'cv' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'lettre_motivation' => 'nullable|file|mimes:pdf,doc,docx|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Vérifier si l'étudiant a déjà postulé
        $existingCandidature = CandidatureTutorat::where('tutorat_id', $id)
            ->where('etudiant_id', $request->etudiant_id)
            ->first();

        if ($existingCandidature) {
            return response()->json(['message' => 'Vous avez déjà postulé à ce tutorat'], 400);
        }

        $data = [
            'tutorat_id' => $id,
            'etudiant_id' => $request->etudiant_id,
            'message_motivation' => $request->message_motivation,
            'date_candidature' => now()
        ];

        // Gérer les fichiers uploadés
        if ($request->hasFile('cv')) {
            $data['cv_path'] = $request->file('cv')->store('candidatures/cv', 'public');
        }

        if ($request->hasFile('lettre_motivation')) {
            $data['lettre_motivation_path'] = $request->file('lettre_motivation')->store('candidatures/lettres', 'public');
        }

        $candidature = CandidatureTutorat::create($data);
        $candidature->load('etudiant.utilisateur');

        return response()->json($candidature, 201);
    }

    /**
     * Gérer les candidatures (accepter/refuser)
     */
    public function gererCandidature(Request $request, $tutoratId, $candidatureId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'statut' => 'required|in:acceptee,refusee'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $candidature = CandidatureTutorat::where('tutorat_id', $tutoratId)
            ->where('id_candidature', $candidatureId)
            ->firstOrFail();

        $candidature->update(['statut' => $request->statut]);

        // Si acceptée, mettre le tutorat comme pourvu
        if ($request->statut === 'acceptee') {
            Tutorat::where('id_tutorat', $tutoratId)->update(['statut' => 'pourvue']);
        }

        return response()->json($candidature);
    }

    /**
     * Obtenir les statistiques des tutorats
     */
    public function statistiques(): JsonResponse
    {
        $stats = [
            'total' => Tutorat::count(),
            'ouverts' => Tutorat::where('statut', 'ouverte')->count(),
            'pourvus' => Tutorat::where('statut', 'pourvue')->count(),
            'clotures' => Tutorat::where('statut', 'cloturee')->count(),
            'candidatures_total' => CandidatureTutorat::count(),
            'candidatures_en_attente' => CandidatureTutorat::where('statut', 'en_attente')->count()
        ];

        return response()->json($stats);
    }

    /**
     * Récupérer les domaines disponibles
     */
    public function domaines(): JsonResponse
    {
        $domaines = \App\Models\Matiere::pluck('nom')->unique()->values();
        return response()->json($domaines);
    }

    /**
     * Récupérer les niveaux disponibles
     */
    public function niveaux(): JsonResponse
    {
        $niveaux = \App\Models\Niveau::pluck('nom')->unique()->values();
        return response()->json($niveaux);
    }
} 