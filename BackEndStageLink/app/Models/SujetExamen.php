<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SujetExamen extends Model
{
    use HasFactory;

    protected $table = 'sujets_examen';

    protected $fillable = [
        'titre',
        'id_matiere',
        'id_niveau',
        'id_annee',
        'fichier_path',
        'est_gratuit',
        'prix',
        'id_upload_par',
        'approuve',
        'telechargements'
    ];

    public function matiere()
    {
        return $this->belongsTo(Matiere::class);
    }

    public function niveau()
    {
        return $this->belongsTo(Niveau::class);
    }

    public function anneeAcademique()
    {
        return $this->belongsTo(AnneeAcademique::class, 'id_annee');
    }

    public function typeSujet()
    {
        return $this->belongsTo(TypeSujet::class, 'id_type');
    }

    public function uploader()
    {
        return $this->belongsTo(Utilisateur::class, 'upload_par');
    }

    public function corriges()
    {
        return $this->hasMany(CorrigeExamen::class);
    }
}