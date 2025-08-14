<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $table = 'admin';

    protected $primaryKey = 'ID_ADMIN';

    protected $fillable = [
        'ID_UTILISATEUR'
    ];

    public $timestamps = false;

    public function utilisateur() {
        return $this->hasOne(Utilisateur::class, 'ID_UTILISATEUR', 'ID_UTILISATEUR');
    }
}
