<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matiere extends Model
{
    use HasFactory;

    protected $table = 'matieres';
    protected $primaryKey = 'id_matiere';

    protected $fillable = [
        'nom',
        'description',
    ];

    // Relations temporairement commentées pour le débogage
    // public function sujetsExamen()
    // {
    //     return $this->hasMany(SujetExamen::class, 'id_matiere', 'id_matiere');
    // }

    public function tuteurs()
    {
        return $this->belongsToMany(ProfilTuteur::class, 'tuteur_matieres')
                    ->withPivot('niveau');
    }

    public function soumissions()
    {
        return $this->hasMany(SoumissionEtudiant::class);
    }
}