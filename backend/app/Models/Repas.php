<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Repas extends Model
{
    use HasFactory;

    protected $table = 'repas';

    protected $primaryKey = 'ID_REPAS';

    public $timestamps = false;

    protected $fillable = [
        'NOM_REPAS',
        'HORAIRE'
    ];

    protected $casts = [
        "HORAIRE" => 'datetime',
    ];

    public function setHORAIREAttribute($value) {
        if($value) {
            $this->attributes['HORAIRE'] = Carbon::parse($value);
        }
    }

    public function menus()
    {
        return $this->belongsToMany(Menu::class, 'menu_repas', 'ID_REPAS', 'ID_MENU');
    }

    public function plats() {
        return $this->belongsToMany(Plat::class, 'repas_plat', 'ID_REPAS', 'ID_PLAT');
    }
}
