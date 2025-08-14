<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $table = 'patient';

    protected $primaryKey = 'ID_PATIENT';

    protected $fillable = [
        'ID_PERSONNE',
        'ID_LIT',
        'DATE_ADMISSION'
    ];

    public $timestamps = false;

    public function personne() {
        return $this->hasOne(Personne::class, 'ID_PERSONNE', 'ID_PERSONNE');
    }

    public function menu_specialise() {
        return $this->hasMany(MenuSpecialise::class, 'ID_PATIENT', 'ID_PATIENT');
    }
}
