<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plat extends Model
{
    use HasFactory;

    protected $table = 'plat';

    protected $primaryKey = 'ID_PLAT';

    public $timestamps = false;

    protected $fillable = [
        'NOM_PLAT',
        'DESCRIPTION',
    ];

    public function repas() {
        return $this->belongsToMany(Repas::class, 'repas_plat', 'ID_PLAT', 'ID_REPAS');
    }

    public function ingredients() {
        return $this->belongsToMany(Ingredient::class, 'plat_ingredient', 'ID_PLAT', 'ID_INGREDIENT');
    }

}
