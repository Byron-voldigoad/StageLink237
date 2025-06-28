<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Langue extends Model
{
    use HasFactory;

    protected $table = 'langues';
    protected $primaryKey = 'id_langue';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nom',
        'code',
    ];

    public function tuteurs()
    {
        return $this->belongsToMany(ProfilTuteur::class, 'tuteur_langues', 'langue_id', 'tuteur_id');
    }
}
