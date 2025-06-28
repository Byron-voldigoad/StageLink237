<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tutorat extends Model
{
    use HasFactory;

    protected $table = 'tutorats';
    protected $primaryKey = 'id_tutorat';

    protected $fillable = [
        'titre',
        'description',
        'domaine',
        'niveau',
        'date_debut',
        'date_fin',
        'tuteur_id',
        'localisation',
        'statut',
        'tarif_horaire',
        'duree_seance',
        'nombre_seances',
        'prerequis',
        'objectifs',
        'methode_pedagogique'
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
        'tarif_horaire' => 'decimal:2',
        'duree_seance' => 'integer',
        'nombre_seances' => 'integer'
    ];

    public function tuteur()
    {
        return $this->belongsTo(ProfilTuteur::class, 'tuteur_id', 'id_tuteur');
    }

    public function candidatures()
    {
        return $this->hasMany(CandidatureTutorat::class, 'tutorat_id', 'id_tutorat');
    }

    public function seances()
    {
        return $this->hasMany(SeanceTutorat::class, 'tutorat_id', 'id_tutorat');
    }

    public function evaluations()
    {
        return $this->hasMany(EvaluationTutorat::class, 'tutorat_id', 'id_tutorat');
    }

    public function scopeDisponible($query)
    {
        return $query->where('statut', 'ouverte');
    }

    public function scopeParDomaine($query, $domaine)
    {
        return $query->where('domaine', $domaine);
    }

    public function scopeParNiveau($query, $niveau)
    {
        return $query->where('niveau', $niveau);
    }
} 