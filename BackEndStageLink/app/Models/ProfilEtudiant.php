<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfilEtudiant extends Model
{
    use HasFactory;

    protected $table = 'profils_etudiants';
    protected $primaryKey = 'id_etudiant';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'utilisateur_id',
        'niveau_etude',
        'etablissement',
        'specialite',
        'objectifs',
        'adresse',
        'cv_path',
        'photo_profil',
        'credits'
    ];

    protected $casts = [
        'credits' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    public function candidatures()
    {
        return $this->hasMany(Candidature::class, 'etudiant_id');
    }

    public function soumissions()
    {
        return $this->hasMany(SoumissionEtudiant::class, 'etudiant_id');
    }

    public function evaluations()
    {
        return $this->hasMany(EvaluationTuteur::class, 'etudiant_id');
    }
}