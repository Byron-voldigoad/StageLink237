<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidature extends Model
{
    use HasFactory;

    protected $fillable = [
        'offre_stage_id',
        'etudiant_id',
        'cv_path',
        'lettre_motivation_path',
        'statut'
    ];

    public function offreStage()
    {
        return $this->belongsTo(OffreStage::class);
    }

    public function etudiant()
    {
        return $this->belongsTo(ProfilEtudiant::class, 'etudiant_id');
    }
}