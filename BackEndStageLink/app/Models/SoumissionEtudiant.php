<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SoumissionEtudiant extends Model
{
    use HasFactory;

    protected $fillable = [
        'etudiant_id',
        'titre',
        'matiere_id',
        'niveau_id',
        'annee_id',
        'fichier_path',
        'statut',
        'commentaire_admin',
        'credits_accordes'
    ];

    public function etudiant()
    {
        return $this->belongsTo(ProfilEtudiant::class, 'etudiant_id');
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class);
    }

    public function niveau()
    {
        return $this->belongsTo(Niveau::class);
    }

    public function annee()
    {
        return $this->belongsTo(AnneeAcademique::class, 'annee_id');
    }
}