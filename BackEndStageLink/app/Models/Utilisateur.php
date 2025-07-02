<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'utilisateurs';
    protected $primaryKey = 'id_utilisateur';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'mot_de_passe',
        'email_verified_at',
        'remember_token',
    ];

    protected $hidden = [
        'mot_de_passe',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'utilisateur_roles', 'utilisateur_id', 'role_id');
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

    /**
     * Indique à Laravel/Sanctum d'utiliser le champ mot_de_passe pour l'authentification.
     */
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }
}