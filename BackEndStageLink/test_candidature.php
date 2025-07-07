<?php

require_once 'vendor/autoload.php';

use Illuminate\Http\Request;
use App\Http\Controllers\CandidatureController;

// Simulate a request
$request = new Request();
$request->merge([
    'offre_stage_id' => 1,
    'etudiant_id' => 1,
    'message_motivation' => 'Test message de motivation'
]);

// Create a mock file
$mockFile = new \Illuminate\Http\UploadedFile(
    __FILE__, // Use this file as a mock
    'test.pdf',
    'application/pdf',
    null,
    true
);

$request->files->set('cv_path', $mockFile);

// Test the controller
$controller = new CandidatureController();

try {
    $response = $controller->store($request);
    echo "Success: " . json_encode($response->getData(), JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
} 