<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_utilisateur',
        'titre',
        'message',
        'type',
        'lu',
        'id_lie',
        'type_lie'
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }
}