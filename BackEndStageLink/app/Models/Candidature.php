<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidature extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_offre_stage',
        'id_etudiant',
        'cv_path',
        'lettre_motivation_path',
        'message_motivation',
        'statut'
    ];

    public function offreStage()
    {
        return $this->belongsTo(OffreStage::class, 'id_offre_stage', 'id_offre_stage');
    }

    public function etudiant()
    {
        return $this->belongsTo(ProfilEtudiant::class, 'id_etudiant', 'id_etudiant');
    }
}