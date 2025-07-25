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
        'telephone',
        'mot_de_passe',
        'email_verified_at',
        'remember_token',
        'photo',
    ];

    protected $hidden = [
        'mot_de_passe',
        'remember_token',
    ];

    protected $appends = ['photo_url'];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];



    public function roles()
    {
        return $this->belongsToMany(Role::class, 'utilisateur_roles', 'utilisateur_id', 'role_id');
    }

    public function profilEtudiant()
    {
        return $this->hasOne(ProfilEtudiant::class, 'utilisateur_id', 'id_utilisateur');
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

    /**
     * Retourne l'URL complète de la photo de profil
     */
    public function getPhotoUrlAttribute()
    {
        if (!$this->photo) {
            return null;
        }
        
        // Si c'est déjà une URL complète, la retourner telle quelle
        if (filter_var($this->photo, FILTER_VALIDATE_URL)) {
            return $this->photo;
        }
        
        // Nettoyer le chemin de la photo
        $photoPath = ltrim($this->photo, '\\/');
        
        // Construire l'URL complète
        $url = asset('storage/' . $photoPath);
        
        // Vérifier si le fichier existe physiquement
        $storagePath = storage_path('app/public/' . $photoPath);
        
        // Journalisation pour le débogage
        \Log::info('Génération URL photo', [
            'photo' => $this->photo,
            'cleaned_path' => $photoPath,
            'url' => $url,
            'storage_path' => $storagePath,
            'file_exists' => file_exists($storagePath)
        ]);
        
        if (!file_exists($storagePath)) {
            \Log::warning("Le fichier photo n'existe pas à l'emplacement : " . $storagePath);
            return null;
        }
        
        return $url;
    }
}