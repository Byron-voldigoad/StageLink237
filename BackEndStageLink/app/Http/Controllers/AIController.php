<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Google\Auth\CredentialsLoader;
use App\Models\OffreStage;
use App\Models\Candidature;
use App\Models\Tutorat;
use App\Models\SujetExamen;
use Smalot\PdfParser\Parser;
use Google\Cloud\AIPlatform\V1\PredictionServiceClient;
use Google\Cloud\AIPlatform\V1\Content;
use Google\Cloud\AIPlatform\V1\GenerateContentRequest;

class AIController extends Controller
{
    private $credentialsLoader;
    private $geminiApiUrl;
    private $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key');
        $this->geminiApiUrl = config('services.gemini.url');
        
        if (empty($this->apiKey)) {
            throw new \RuntimeException('La clé API Gemini n\'est pas configurée');
        }
        if (empty($this->geminiApiUrl)) {
            throw new \RuntimeException('L\'URL de l\'API Gemini n\'est pas configurée');
        }
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

        $prompt = "Génère une lettre de motivation professionnelle mais simple pour le poste suivant :\n\n";
        $prompt .= "Titre du poste : {$offre->titre}\n";
        $prompt .= "Entreprise : {$offre->entreprise->nom}\n";
        $prompt .= "Description : {$offre->description}\n";
        if ($offre->exigences) {
            $prompt .= "Exigences : {$offre->exigences}\n";
        }
        if ($offre->competences_requises) {
            $competencesRequises = $offre->competences_requises;
            if (is_array($competencesRequises)) {
                $competencesRequises = implode(', ', $competencesRequises);
            }
            $prompt .= "Compétences requises : {$competencesRequises}\n";
        }
        
        $prompt .= "\nLa lettre doit être :\n";
        $prompt .= "- Professionnelle et convaincante\n";
        $prompt .= "- Adaptée au poste et à l'entreprise\n";
        $prompt .= "- En français\n";
        $prompt .= "- D'environ 100-200 mots\n";
        $prompt .= "- Structurée avec une introduction, un développement et une conclusion\n";
        $prompt .= "- Et prêt à l'emploi donc l'utilisateur ne doit plus avoir besoin de la modifier\n";

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
        try {
             Log::info('Request Headers:', $request->headers->all());
        Log::info('Request Data:', $request->all());
        
            $request->validate([
                'cv_path' => 'required|string|regex:/^candidatures\/cv\/[a-zA-Z0-9_\-\.]+\.pdf$/',
                'offre_id' => 'required|exists:offres_stage,id_offre_stage'
            ]);

            $fullPath = storage_path('app/public/' . $request->cv_path);
            if (!file_exists($fullPath)) {
                throw new \Exception("Fichier CV introuvable: " . $fullPath);
            }

            $offre = OffreStage::findOrFail($request->offre_id);
            
            
            $cvContent = $this->extractTextFromPDF($request->cv_path);

            $prompt = $this->buildCVAnalysisPrompt($offre, $cvContent);
            $geminiResponse = $this->callGeminiAPI($prompt);

            // Formatage strict de la réponse
            $analysis = $this->formatGeminiResponse($geminiResponse);
            
            if (!isset($analysis['score_pertinence']) || !isset($decoded['niveau_adequation'])) {
                throw new \Exception("Réponse de l'IA incomplète");
            }

            return response()->json([
                'success' => true,
                'analysis' => $analysis
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur analyse CV: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => env('APP_DEBUG') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    /**
     * Analyse un CV pour évaluer sa pertinence par rapport à une offre
     */

private function buildCVAnalysisPrompt($offre, $cvContent): string
{
    
    // S'assurer que competences_requises est une chaîne
    $competencesRequises = $offre->competences_requises;
    if (is_array($competencesRequises)) {
        $competencesRequises = implode(', ', $competencesRequises);
    } elseif (empty($competencesRequises)) {
        $competencesRequises = 'Non spécifiées';
    }

    // S'assurer que tous les champs sont des chaînes
    $titre = is_string($offre->titre) ? $offre->titre : (string)$offre->titre;
    $description = is_string($offre->description) ? $offre->description : (string)$offre->description;
    $cvContentStr = is_string($cvContent) ? $cvContent : (string)$cvContent;

    return "Tu es un expert en analyse de CV. Analyse ce CV pour une offre de stage et retourne UNIQUEMENT un JSON STRICTEMENT VALIDE avec les champs suivants:
    {
        \"score_pertinence\": 0-100, // Score global de pertinence
        \"niveau_adequation\": \"faible\"|\"moyen\"|\"élevé\", // Niveau global d'adéquation
        \"competences\": [\"liste\", \"des\", \"compétences\"], 
        \"points_forts\": [\"points\", \"forts\"],
        \"points_faibles\": [\"points\", \"faibles\"],
        \"recommandations\": [\"recommandations\"]
    }

    Offre: {$titre}
    Description: {$description}
    Compétences requises: {$competencesRequises}

    Contenu du CV:
    {$cvContentStr}";
}

private function formatGeminiResponse(string $jsonResponse)
{
    $decoded = json_decode($jsonResponse, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new \Exception("Réponse JSON invalide de l'API");
    }
    
    // Nettoyage supplémentaire si nécessaire
    if (is_string($decoded)) {
        $cleaned = str_replace(['```json', '```'], '', $decoded);
        $decoded = json_decode($cleaned, true);
    }

     $requiredFields = [
        'score_pertinence', 
        'niveau_adequation',
        'competences',
        'points_forts',
        'points_faibles',
        'recommandations'
    ];

    foreach ($requiredFields as $field) {
        if (!array_key_exists($field, $decoded)) {
            Log::error('Champ manquant dans la réponse', [
                'champ_manquant' => $field,
                'reponse_complete' => $decoded
            ]);
            throw new \Exception("Réponse de l'IA incomplète: champ $field manquant");
        }
    }

    // Validation supplémentaire pour niveau_adequation
    $niveauxValides = ['faible', 'moyen', 'élevé'];
    if (!in_array(strtolower($decoded['niveau_adequation']), $niveauxValides)) {
        throw new \Exception("niveau_adequation invalide");
    }
    
    return $decoded;
}

    /**
     * Extrait le texte d'un fichier PDF
     */
    private function extractTextFromPDF($filePath): string
{
    try {
        $fullPath = storage_path('app/public/' . $filePath);
        Log::info("Chemin complet du PDF: " . $fullPath);
        
        if (!file_exists($fullPath)) {
            throw new \Exception("Fichier PDF non trouvé: {$fullPath}");
        }

        $parser = new Parser();
        $pdf = $parser->parseFile($fullPath);
        $text = $pdf->getText();
        
        return $text ?: "Impossible d'extraire le texte du PDF";
    } catch (\Exception $e) {
        Log::error("Erreur extraction PDF: " . $e->getMessage());
        throw $e;
    }
}

    /**
     * Appel à l'API Gemini
     */
   private function callGeminiAPI(string $prompt)
{
    try {
        $response = Http::timeout(30)->post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=".env('GEMINI_API_KEY'), 
            [
                'contents' => [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ],
                'generationConfig' => [
                    'response_mime_type' => 'application/json'
                ]
            ]
        );

        if (!$response->successful()) {
            throw new \Exception('Erreur API: '.$response->body());
        }

        $responseData = $response->json();
        
        // Retourne TOUJOURS une string JSON
        return $responseData['candidates'][0]['content']['parts'][0]['text'];

    } catch (\Exception $e) {
        // Retourne aussi une string JSON en cas d'erreur
        return json_encode([
            'error' => $e->getMessage(),
            'raw_response' => $response->body() ?? null
        ]);
    }
}

    /**
     * Obtenir la liste des modèles disponibles
     */
    public function listModels()
    {
        $config = config('services.gemini');
        
        if (empty($config['key'])) {
            throw new \Exception('Clé API Gemini non configurée');
        }
    }

    /**
     * Construction du prompt pour l'analyse d'offre
     */
    private function buildOffreAnalysisPrompt($offre): string
    {
        return <<<PROMPT
        Analyse cette offre de stage et retourne un JSON structuré avec :
        - competences: liste des compétences techniques identifiées
        - niveau_difficulte: [debutant|intermediaire|avance]
        - mots_cles: 5 mots-clés principaux
        - suggestions_amelioration: 3 suggestions pour améliorer l'offre
        - score_pertinence: score de 0 à 100
        
        Offre à analyser :
        Titre: {$offre->titre}
        Description: {$offre->description}
        Compétences requises: " . (is_array($offre->competences_requises) ? implode(', ', $offre->competences_requises) : ($offre->competences_requises ?: 'Non spécifiées')) . "
        Exigences: {$offre->exigences}
        
        Exemple de réponse attendue :
        {
        "competences": ["Marketing Digital", "Réseaux Sociaux"],
        "niveau_difficulte": "intermediaire",
        "mots_cles": ["digital", "stage", "marketing"],
        "suggestions_amelioration": ["Préciser les outils à maîtriser", "Ajouter des exemples de missions"],
        "score_pertinence": 75
        }
        PROMPT;
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
        Compétences requises: " . (is_array($candidature->offreStage->competences_requises) ? implode(', ', $candidature->offreStage->competences_requises) : ($candidature->offreStage->competences_requises ?: 'Non spécifiées')) . "
        
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
            $keywordsResponse = $this->callGeminiAPI($prompt);
            
            // Nettoyer la réponse et essayer de la décoder
            $cleaned = str_replace(['```json', '```'], '', $keywordsResponse);
            $decoded = json_decode($cleaned, true);
            
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return $decoded;
            }
            
            // Si le décodage échoue, retourner la requête originale
            return [$query];
        } catch (\Exception $e) {
            Log::error('Erreur extraction mots-clés: ' . $e->getMessage());
            return [$query];
        }
    }
} 