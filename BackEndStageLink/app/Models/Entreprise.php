<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entreprise extends Model
{
    use HasFactory;

    protected $table = 'entreprises';
    protected $primaryKey = 'id_entreprise';

    protected $fillable = [
        'id_utilisateur',
        'nom',
        'description',
        'secteur',
        'telephone',
        'adresse',
        'site_web',
        'logo_path',
        'nif',
        'verifie'
    ];

    protected $casts = [
        'verifie' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function offresStage()
    {
        return $this->hasMany(OffreStage::class, 'id_entreprise');
    }

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'id_utilisateur');
    }
}