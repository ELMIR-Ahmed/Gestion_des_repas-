<?php

namespace App\Models;

use Carbon\Carbon;
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
    
    
    protected $casts = [
        "DATE_NAISSANCE" => 'datetime',
    ];

    public function setHORAIREAttribute($value) {
        if($value) {
            $this->attributes['DATE_NAISSANCE'] = Carbon::parse($value);
        }
    }

    public function personne() {
        return $this->hasOne(Personne::class, 'ID_PERSONNE', 'ID_PERSONNE');
    }

    public function menu_specialise() {
        return $this->hasMany(MenuSpecialise::class, 'ID_PATIENT', 'ID_PATIENT');
    }

    public function lit() {
        return $this->hasOne(Lit::class, 'ID_LIT', 'ID_LIT');
    }

    public function allergies() {
        return $this->belongsToMany(Allergie::class, 'patient_allergie', 'ID_PATIENT', 'ID_ALLERGIE');
    }

    public function pathologies() {
        return $this->belongsToMany(Pathologie::class, 'patient_pathologie', 'ID_PATIENT', 'ID_PATHOLOGIE');
    }
}
