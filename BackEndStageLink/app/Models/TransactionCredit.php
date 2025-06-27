<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionCredit extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_utilisateur',
        'montant',
        'type',
        'methode_paiement',
        'reference_transaction',
        'statut'
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }
}