<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dieteticien extends Model
{
    protected $table = 'dieteticien';

    protected $primaryKey = 'ID_DIETETICIEN';

    protected $fillable = [
        'ID_UTILISATEUR',
        'NUM_LICENCE'
    ];

    public $timestamps = false;

    public function utilisateur() {
        return $this->hasOne(Utilisateur::class, 'ID_UTILISATEUR', 'ID_UTILISATEUR');
    }
}
