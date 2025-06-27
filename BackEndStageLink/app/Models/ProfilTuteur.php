<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfilTuteur extends Model
{
    use HasFactory;

    protected $table = 'profils_tuteurs';
    protected $primaryKey = 'id_tuteur';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'id_utilisateur',
        'prenom',
        'nom',
        'telephone',
        'adresse',
        'qualifications',
        'certifications',
        'annees_experience',
        'tarif_horaire',
        'photo_profil',
        'disponible',
        'note'
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur', 'id_utilisateur');
    }

    public function matieres()
    {
        return $this->belongsToMany(Matiere::class, 'tuteur_matieres')
                    ->withPivot('niveau');
    }

    public function corriges()
    {
        return $this->hasMany(CorrigeExamen::class, 'tuteur_id');
    }

    public function evaluations()
    {
        return $this->hasMany(EvaluationTuteur::class, 'tuteur_id');
    }
}