<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    protected $table = 'ingredient';

    protected $primaryKey = 'ID_INGREDIENT';

    public $timestamps = false;

    protected $fillable = [
        'NOM_INGREDIENT',
        'TYPE_INGREDIENT',
    ];

    public function allergies()
    {
        return $this->belongsToMany(Allergie::class, 'ingredient_allergie', 'ID_INGREDIENT', 'ID_ALLERGIE');
    }

    public function plats() {
        return $this->belongsToMany(Plat::class, 'plat_ingredient', 'ID_INGREDIENT', 'ID_PLAT');
    }
}
