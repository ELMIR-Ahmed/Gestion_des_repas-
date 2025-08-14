<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cuisinier extends Model
{
    protected $table = 'cuisinier';

    protected $primaryKey = 'ID_CUISINIER';

    protected $fillable = [
        'ID_UTILISATEUR',
        'TYPE_CUISINE'
    ];

    public $timestamps = false;

    public function utilisateur() {
        return $this->hasOne(Utilisateur::class, 'ID_UTILISATEUR', 'ID_UTILISATEUR');
    }
}
