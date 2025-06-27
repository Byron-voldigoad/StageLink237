<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CorrigeExamen extends Model
{
    use HasFactory;

    protected $fillable = [
        'sujet_examen_id',
        'tuteur_id',
        'fichier_path',
        'prix',
        'approuve',
        'telechargements'
    ];

    public function sujet()
    {
        return $this->belongsTo(SujetExamen::class, 'sujet_examen_id');
    }

    public function tuteur()
    {
        return $this->belongsTo(ProfilTuteur::class, 'tuteur_id');
    }
}