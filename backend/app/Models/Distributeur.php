<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Distributeur extends Model
{
    protected $table = 'distributeur';

    protected $primaryKey = 'ID_DISTRIBUTEUR';

    protected $fillable = [
        'ID_UTILISATEUR',
        'NUM_BADGE'
    ];

    public $timestamps = false;

    public function utilisateur() {
        return $this->hasOne(Utilisateur::class, 'ID_UTILISATEUR', 'ID_UTILISATEUR');
    }
}
