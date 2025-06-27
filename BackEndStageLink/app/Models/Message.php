<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $table = 'messages';
    protected $primaryKey = 'id_message';

    protected $fillable = [
        'id_expediteur',
        'id_destinataire',
        'contenu',
        'lu'
    ];

    protected $casts = [
        'lu' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function expediteur()
    {
        return $this->belongsTo(User::class, 'id_expediteur');
    }

    public function destinataire()
    {
        return $this->belongsTo(User::class, 'id_destinataire');
    }
}