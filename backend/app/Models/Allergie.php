<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Allergie extends Model
{
    protected $table = 'allergie';

    protected $primaryKey = 'ID_ALLERGIE';

    public $timestamps = false;

    public $incrementing = true; // ou false si la clé n'est pas auto-incrémentée

    protected $keyType = 'int';  // ou 'string' selon le type

    protected $fillable = [
        'NOM_ALLERGIE',
    ];

    public function getRouteKeyName()
    {
        return 'ID_ALLERGIE';
    }

    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class, 'ingredient_allerdgie', 'ID_ALLERGIE', 'ID_INGREDIENT');
    }

    public function patients()
    {
        return $this->belongsToMany(Patient::class, 'patient_allergie', 'ID_ALLERGIE', 'ID_PATIENT');
    }
}
