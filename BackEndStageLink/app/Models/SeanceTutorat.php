<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeanceTutorat extends Model
{
    use HasFactory;

    protected $table = 'seances_tutorat';
    protected $primaryKey = 'id_seance';

    protected $fillable = [
        'tutorat_id',
        'date_seance',
        'heure_debut',
        'heure_fin',
        'lieu',
        'mode', // 'presentiel', 'en_ligne', 'hybride'
        'lien_visio',
        'statut', // 'planifiee', 'en_cours', 'terminee', 'annulee'
        'notes_tuteur',
        'notes_etudiant',
        'materiel_requis'
    ];

    protected $casts = [
        'date_seance' => 'date',
        'heure_debut' => 'datetime',
        'heure_fin' => 'datetime'
    ];

    public function tutorat()
    {
        return $this->belongsTo(Tutorat::class, 'tutorat_id', 'id_tutorat');
    }
} 