<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeSujet extends Model
{
    use HasFactory;

    protected $table = 'types_sujets';
    protected $primaryKey = 'id_type';

    protected $fillable = [
        'nom',
        'description',
    ];

    public function sujetsExamen()
    {
        return $this->hasMany(SujetExamen::class, 'id_type', 'id_type');
    }
} 