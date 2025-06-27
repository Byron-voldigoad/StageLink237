<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Niveau extends Model
{
    use HasFactory;

    protected $table = 'niveaux';
    protected $primaryKey = 'id_niveau';

    protected $fillable = ['nom', 'description'];

    public function sujets()
    {
        return $this->hasMany(SujetExamen::class, 'id_niveau', 'id_niveau');
    }

    public function soumissions()
    {
        return $this->hasMany(SoumissionEtudiant::class, 'id_niveau', 'id_niveau');
    }
}