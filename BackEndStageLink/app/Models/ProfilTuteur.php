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
        'utilisateur_id',
        'bio',
        'specialites',
        'tarif_horaire',
        'experience_annees',
        'diplomes',
        'methodes_pedagogiques',
        'adresse',
        'qualifications',
        'certifications',
        'photo_profil',
        'disponible',
        'note',
        'ville', // Ajouté
        'code_postal' // Ajouté
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id', 'id_utilisateur');
    }

    public function matieres()
    {
        // Correction : clé étrangère tuteur_id, clé associée matiere_id
        return $this->belongsToMany(Matiere::class, 'tuteur_matieres', 'tuteur_id', 'matiere_id')
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

    /**
     * Langues parlées par le tuteur
     */
    public function langues()
    {
        return $this->belongsToMany(\App\Models\Langue::class, 'tuteur_langues', 'tuteur_id', 'langue_id');
    }
}