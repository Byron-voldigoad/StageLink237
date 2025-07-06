<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OffreStage;

class Secteur extends Model
{
    use HasFactory;

    protected $table = 'secteurs';
    protected $fillable = ['nom'];

    public function offresStage()
    {
        return $this->hasMany(OffreStage::class, 'secteur_id');
    }
}