<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CandidatureTutorat extends Model
{
    use HasFactory;

    protected $table = 'candidatures_tutorat';
    protected $primaryKey = 'id_candidature';

    protected $fillable = [
        'tutorat_id',
        'etudiant_id',
        'statut',
        'message_motivation',
        'cv_path',
        'lettre_motivation_path',
        'date_candidature'
    ];

    protected $casts = [
        'date_candidature' => 'datetime'
    ];

    public function tutorat()
    {
        return $this->belongsTo(Tutorat::class, 'tutorat_id', 'id_tutorat');
    }

    public function etudiant()
    {
        return $this->belongsTo(ProfilEtudiant::class, 'etudiant_id', 'id_etudiant');
    }
} 