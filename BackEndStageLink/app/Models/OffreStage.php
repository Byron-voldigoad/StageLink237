<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OffreStage extends Model
{
    use HasFactory;

    protected $table = 'offres_stage';
    protected $primaryKey = 'id_offre_stage';

    protected $fillable = [
        'id_entreprise',
        'titre',
        'description',
        'exigences',
        'competences_requises',
        'duree',
        'date_debut',
        'date_fin',
        'localisation',
        'remuneration',
        'secteur',
        'statut'
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
        'remuneration' => 'float',
        'date_creation' => 'datetime',
        'date_modification' => 'datetime'
    ];

    protected $with = ['entreprise'];

    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class, 'id_entreprise', 'id_entreprise');
    }

    public function candidatures()
    {
        return $this->hasMany(Candidature::class);
    }

    public function secteur()
    {
        return $this->belongsTo(Secteur::class, 'secteur_id');
    }
}