<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\OffreStage;
use App\Models\Candidature;
use App\Models\Tutorat;
use App\Models\SujetExamen;
use Smalot\PdfParser\Parser;

class AIController extends Controller
{
    private $geminiApiKey;
    private $geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    public function __construct()
    {
        $this->geminiApiKey = env('GEMINI_API_KEY');
    }

    /**
     * Analyse une offre de stage avec l'IA
     */
    public function analyzeOffreStage(Request $request): JsonResponse
    {
        try {
            $offreId = $request->input('offre_id');
            $offre = OffreStage::with(['entreprise', 'getSecteur'])->find($offreId);

            if (!$offre) {
                return response()->json(['error' => 'Offre non trouvée'], 404);
            }

            $prompt = $this->buildOffreAnalysisPrompt($offre);
            $analysis = $this->callGeminiAPI($prompt);

            return response()->json([
                'success' => true,
                'analysis' => $analysis
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur analyse offre IA: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de l\'analyse'], 500);
        }
    }

    /**
     * Analyse une candidature avec l'IA
     */
    public function analyzeCandidature(Request $request): JsonResponse
    {
        try {
            $candidatureId = $request->input('candidature_id');
            $candidature = Candidature::with(['offreStage', 'profilEtudiant'])->find($candidatureId);

            if (!$candidature) {
                return response()->json(['error' => 'Candidature non trouvée'], 404);
            }

            $prompt = $this->buildCandidatureAnalysisPrompt($candidature);
            $analysis = $this->callGeminiAPI($prompt);

            return response()->json([
                'success' => true,
                'analysis' => $analysis
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur analyse candidature IA: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de l\'analyse'], 500);
        }
    }

    /**
     * Génère des recommandations de tutorat
     */
    public function generateTutoratRecommendations(Request $request): JsonResponse
    {
        try {
            $etudiantId = $request->input('etudiant_id');
            $matieres = $request->input('matieres', []);

            $prompt = $this->buildTutoratRecommendationPrompt($etudiantId, $matieres);
            $recommendations = $this->callGeminiAPI($prompt);

            return response()->json([
                'success' => true,
                'recommendations' => $recommendations
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur recommandations tutorat IA: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la génération'], 500);
        }
    }

    /**
     * Améliore une description d'offre
     */
    public function improveDescription(Request $request): JsonResponse
    {
        try {
            $description = $request->input('description');
            
            if (empty($description)) {
                return response()->json(['error' => 'Description requise'], 400);
            }

            $prompt = $this->buildDescriptionImprovementPrompt($description);
            $improvedDescription = $this->callGeminiAPI($prompt);

            return response()->json([
                'success' => true,
                'improved_description' => $improvedDescription
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur amélioration description IA: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de l\'amélioration'], 500);
        }
    }

    /**
     * Génère des suggestions de sujets d'examen
     */
    public function generateSujetSuggestions(Request $request): JsonResponse
    {
        try {
            $matiere = $request->input('matiere');
            $niveau = $request->input('niveau');

            if (empty($matiere) || empty($niveau)) {
                return response()->json(['error' => 'Matière et niveau requis'], 400);
            }

            $prompt = $this->buildSujetSuggestionsPrompt($matiere, $niveau);
            $suggestions = $this->callGeminiAPI($prompt);

            return response()->json([
                'success' => true,
                'suggestions' => $suggestions
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur suggestions sujets IA: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la génération'], 500);
        }
    }

    /**
     * Recherche intelligente d'offres
     */
    public function intelligentSearch(Request $request): JsonResponse
    {
        try {
            $query = $request->input('query');
            $keywords = $this->extractKeywords($query);

            $offres = OffreStage::with(['entreprise', 'getSecteur'])
                ->where(function($q) use ($keywords) {
                    foreach ($keywords as $keyword) {
                        $q->where(function($subQ) use ($keyword) {
                            $subQ->where('titre', 'LIKE', "%{$keyword}%")
                                 ->orWhere('description', 'LIKE', "%{$keyword}%")
                                 ->orWhere('competences_requises', 'LIKE', "%{$keyword}%");
                        });
                    }
                })
                ->where('statut', 'ouvert')
                ->orderBy('date_creation', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'offres' => $offres,
                'keywords' => $keywords
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur recherche intelligente IA: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la recherche'], 500);
        }
    }

    /**
     * Génère une lettre de motivation IA pour une offre donnée
     */
    public function generateMotivation(Request $request)
    {
        $request->validate([
            'offre_id' => 'required|integer|exists:offres_stage,id_offre_stage'
        ]);

        $offre = OffreStage::with('entreprise')->find($request->offre_id);
        
        if (!$offre) {
            return response()->json(['error' => 'Offre non trouvée'], 404);
        }

        $prompt = "Génère une lettre de motivation professionnelle pour le poste suivant :\n\n";
        $prompt .= "Titre du poste : {$offre->titre}\n";
        $prompt .= "Entreprise : {$offre->entreprise->nom}\n";
        $prompt .= "Description : {$offre->description}\n";
        if ($offre->exigences) {
            $prompt .= "Exigences : {$offre->exigences}\n";
        }
        if ($offre->competences_requises) {
            $prompt .= "Compétences requises : {$offre->competences_requises}\n";
        }
        
        $prompt .= "\nLa lettre doit être :\n";
        $prompt .= "- Professionnelle et convaincante\n";
        $prompt .= "- Adaptée au poste et à l'entreprise\n";
        $prompt .= "- En français\n";
        $prompt .= "- D'environ 300-400 mots\n";
        $prompt .= "- Structurée avec une introduction, un développement et une conclusion\n";

        $response = $this->callGeminiAPI($prompt);
        
        return response()->json([
            'motivation' => $response
        ]);
    }

    /**
     * Analyse un CV pour évaluer sa pertinence par rapport à une offre
     */
    public function analyzeCV(Request $request)
    {
        $request->validate([
            'cv_path' => 'required|string',
            'offre_id' => 'required|integer|exists:offres_stage,id_offre_stage',
            'titre_offre' => 'required|string',
            'description_offre' => 'required|string',
            'competences_requises' => 'nullable|string',
            'exigences' => 'nullable|string'
        ]);

        // Extraire le texte du PDF
        $cvContent = $this->extractTextFromPDF($request->cv_path);

        $prompt = "Analyse ce CV par rapport à l'offre de stage suivante et attribue un score de pertinence de 0 à 100.\n\n";
        $prompt .= "OFFRE DE STAGE :\n";
        $prompt .= "Titre : {$request->titre_offre}\n";
        $prompt .= "Description : {$request->description_offre}\n";
        if ($request->competences_requises) {
            $prompt .= "Compétences requises : {$request->competences_requises}\n";
        }
        if ($request->exigences) {
            $prompt .= "Exigences : {$request->exigences}\n";
        }
        
        $prompt .= "\nCV DU CANDIDAT (texte extrait) :\n";
        $prompt .= $cvContent;
        
        $prompt .= "\n\nAnalyse ce CV et réponds en JSON avec la structure suivante :\n";
        $prompt .= "{\n";
        $prompt .= "  \"score_pertinence\": 85,\n";
        $prompt .= "  \"competences_detectees\": [\"JavaScript\", \"React\", \"Node.js\"],\n";
        $prompt .= "  \"experience_pertinente\": [\"Stage de 6 mois en développement web\"],\n";
        $prompt .= "  \"points_forts\": [\"Bonne maîtrise des technologies requises\", \"Expérience pertinente\"],\n";
        $prompt .= "  \"points_faibles\": [\"Manque d'expérience en équipe\"],\n";
        $prompt .= "  \"recommandations\": [\"Mettre en avant les projets personnels\"],\n";
        $prompt .= "  \"niveau_adequation\": \"bon\",\n";
        $prompt .= "  \"temps_formation_estime\": \"2-3 semaines\"\n";
        $prompt .= "}\n\n";
        $prompt .= "Critères d'évaluation :\n";
        $prompt .= "- Score 90-100 : Excellent match, candidat idéal\n";
        $prompt .= "- Score 70-89 : Bon match, candidat prometteur\n";
        $prompt .= "- Score 50-69 : Match moyen, formation nécessaire\n";
        $prompt .= "- Score 30-49 : Match faible, formation importante requise\n";
        $prompt .= "- Score 0-29 : Match très faible, non recommandé\n";

        $response = $this->callGeminiAPI($prompt);
        
        // Essayer de parser la réponse JSON
        $analysis = json_decode($response, true);
        if (!$analysis) {
            // Si le parsing échoue, créer une réponse par défaut
            $analysis = [
                'score_pertinence' => 50,
                'competences_detectees' => [],
                'experience_pertinente' => [],
                'points_forts' => ['Analyse automatique en cours'],
                'points_faibles' => [],
                'recommandations' => ['Vérifier manuellement le CV'],
                'niveau_adequation' => 'moyen',
                'temps_formation_estime' => 'À évaluer'
            ];
        }
        
        return response()->json($analysis);
    }

    /**
     * Extrait le texte d'un fichier PDF
     */
    private function extractTextFromPDF($filePath): string
    {
        try {
            $fullPath = storage_path('app/public/' . $filePath);
            
            if (!file_exists($fullPath)) {
                Log::warning("Fichier PDF non trouvé: {$fullPath}");
                return "Fichier PDF non accessible: {$filePath}";
            }

            $parser = new Parser();
            $pdf = $parser->parseFile($fullPath);
            $text = $pdf->getText();
            
            // Nettoyer le texte
            $text = preg_replace('/\s+/', ' ', $text); // Remplacer les espaces multiples
            $text = trim($text);
            
            return $text ?: "Impossible d'extraire le texte du PDF";
        } catch (\Exception $e) {
            Log::error("Erreur extraction PDF: " . $e->getMessage());
            return "Erreur lors de l'extraction du texte du PDF: " . $e->getMessage();
        }
    }

    /**
     * Appel à l'API Gemini
     */
    private function callGeminiAPI(string $prompt): array
    {
        if (empty($this->geminiApiKey)) {
            throw new \Exception('Clé API Gemini non configurée');
        }

        $response = Http::withHeaders([
            'Content-Type' => 'application/json'
        ])->post($this->geminiApiUrl . '?key=' . $this->geminiApiKey, [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ]
        ]);

        if (!$response->successful()) {
            throw new \Exception('Erreur API Gemini: ' . $response->body());
        }

        $data = $response->json();
        $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

        // Essayer de parser le JSON de la réponse
        try {
            return json_decode($text, true) ?: ['text' => $text];
        } catch (\Exception $e) {
            return ['text' => $text];
        }
    }

    /**
     * Construction du prompt pour l'analyse d'offre
     */
    private function buildOffreAnalysisPrompt($offre): string
    {
        return "
        Analyse cette offre de stage et fournis une réponse structurée en JSON :
        
        Titre: {$offre->titre}
        Description: {$offre->description}
        Exigences: " . ($offre->exigences ?: 'Non spécifiées') . "
        Compétences requises: " . ($offre->competences_requises ?: 'Non spécifiées') . "
        Secteur: " . ($offre->getSecteur ? $offre->getSecteur->nom : 'Non spécifié') . "
        
        Réponds avec un JSON contenant:
        {
            \"competences\": [\"liste des compétences identifiées\"],
            \"niveau_difficulte\": \"debutant|intermediaire|avance\",
            \"mots_cles\": [\"mots-clés importants\"],
            \"suggestions_amelioration\": [\"suggestions pour améliorer l'offre\"],
            \"score_pertinence\": 85
        }
        ";
    }

    /**
     * Construction du prompt pour l'analyse de candidature
     */
    private function buildCandidatureAnalysisPrompt($candidature): string
    {
        return "
        Analyse cette candidature par rapport à l'offre de stage et fournis une réponse en JSON :
        
        OFFRE:
        Titre: {$candidature->offreStage->titre}
        Compétences requises: " . ($candidature->offreStage->competences_requises ?: 'Non spécifiées') . "
        
        CANDIDATURE:
        CV: " . ($candidature->cv_path ?: 'Non fourni') . "
        Lettre de motivation: " . ($candidature->lettre_motivation ?: 'Non fournie') . "
        
        Réponds avec un JSON:
        {
            \"score_competences\": 75,
            \"competences_manquantes\": [\"compétences manquantes\"],
            \"suggestions_cv\": [\"suggestions pour améliorer le CV\"],
            \"score_global\": 80,
            \"recommandations\": [\"recommandations générales\"]
        }
        ";
    }

    /**
     * Construction du prompt pour les recommandations de tutorat
     */
    private function buildTutoratRecommendationPrompt($etudiantId, $matieres): string
    {
        return "
        Génère des recommandations de tutorat personnalisées en JSON :
        
        Matières d'intérêt: " . implode(', ', $matieres) . "
        
        Réponds avec un JSON:
        {
            \"matieres_suggerees\": [\"matières recommandées\"],
            \"niveau_recommande\": \"débutant|intermédiaire|avancé\",
            \"methode_pedagogique\": \"méthode recommandée\",
            \"ressources_utiles\": [\"ressources utiles\"]
        }
        ";
    }

    /**
     * Construction du prompt pour l'amélioration de description
     */
    private function buildDescriptionImprovementPrompt($description): string
    {
        return "
        Améliore cette description d'offre de stage pour la rendre plus attractive et professionnelle :
        
        \"{$description}\"
        
        Fournis uniquement la description améliorée sans commentaires.
        ";
    }

    /**
     * Construction du prompt pour les suggestions de sujets
     */
    private function buildSujetSuggestionsPrompt($matiere, $niveau): string
    {
        return "
        Génère 5 suggestions de sujets d'examen pour {$matiere} niveau {$niveau}.
        Réponds avec un JSON array: [\"sujet 1\", \"sujet 2\", \"sujet 3\", \"sujet 4\", \"sujet 5\"]
        ";
    }

    /**
     * Extraction de mots-clés pour la recherche intelligente
     */
    private function extractKeywords($query): array
    {
        $prompt = "
        Extrais les mots-clés importants de ce texte pour une recherche intelligente :
        
        \"{$query}\"
        
        Réponds avec un JSON array des mots-clés: [\"mot1\", \"mot2\", \"mot3\"]
        ";

        try {
            $keywords = $this->callGeminiAPI($prompt);
            return is_array($keywords) ? $keywords : [$query];
        } catch (\Exception $e) {
            return [$query];
        }
    }
} 