<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected $table = "utilisateur";

    protected $primaryKey = "ID_UTILISATEUR";

    public $timestamps = false;

    protected $fillable = [
        'ID_PERSONNE',
        'LOGIN',
        'PASSWORD',
        "ROLE"
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */

        protected $hidden = [ // <-- AJOUTEZ CETTE LIGNE
        'PASSWORD',      // <-- ET CELLE-CI !
        // 'remember_token', // Si vous avez cette colonne et voulez la cacher aussi
    ];


    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            
        ];
    }

    public function personne()
    {
        return $this->belongsTo(Personne::class, 'ID_PERSONNE', 'ID_PERSONNE');
    }

    public function admin() {
        return $this->belongsTo(Admin::class, 'ID_UTILISATEUR', 'ID_UTILISATEUR');
    }

    public function dieteticien() {
        return $this->belongsTo(Dieteticien::class, 'ID_UTILISATEUR', 'ID_UTILISATEUR');
    }

    public function cuisinier() {
        return $this->belongsTo(Cuisinier::class, 'ID_UTILISATEUR', 'ID_UTILISATEUR');
    }

    public function distributeur() {
        return $this->belongsTo(Distributeur::class, 'ID_UTILISATEUR', 'ID_UTILISATEUR');
    }

    public function getAuthIdentifierName() {
        return 'LOGIN';
    }
}
