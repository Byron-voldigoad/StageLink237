<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluationTuteur extends Model
{
    use HasFactory;

    protected $fillable = [
        'tuteur_id',
        'etudiant_id',
        'note',
        'commentaire'
    ];

    public function tuteur()
    {
        return $this->belongsTo(ProfilTuteur::class, 'tuteur_id');
    }

    public function etudiant()
    {
        return $this->belongsTo(ProfilEtudiant::class, 'etudiant_id');
    }
}