<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Utilisateur extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'utilisateurs';
    protected $primaryKey = 'id_utilisateur';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'email',
        'password',
        'email_verified_at',
        'remember_token',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'utilisateur_roles', 'id_utilisateur', 'id_role');
    }

    public function profilEtudiant()
    {
        return $this->hasOne(ProfilEtudiant::class, 'id_utilisateur', 'id_utilisateur');
    }

    public function profilTuteur()
    {
        return $this->hasOne(ProfilTuteur::class, 'id_utilisateur');
    }

    public function entreprise()
    {
        return $this->hasOne(Entreprise::class, 'id_utilisateur');
    }

    public function hasRole($role)
    {
        return $this->roles()->where('nom', $role)->exists();
    }
}