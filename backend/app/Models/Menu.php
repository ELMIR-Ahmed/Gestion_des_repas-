<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $table = 'menu';

    protected $primaryKey = 'ID_MENU';

    public $timestamps = false;

    protected $fillable = [
        'ID_DIETETICIEN',
        'DATE_DEBUT',
        'DATE_FIN',
        'DATE_CREATION',
    ];

    protected $casts = [
        "DATE_DEBUT" => 'datetime',
        "DATE_FIN" => 'datetime',
        "DATE_CREATION" => 'datetime',
    ];

    public function setHORAIREAttribute($value) {
        if($value) {
            $this->attributes['DATE_DEBUT'] = Carbon::parse($value);
            $this->attributes['DATE_FIN'] = Carbon::parse($value);
            $this->attributes['DATE_CREATION'] = Carbon::parse($value);
        }
    }

    public function dieteticien() {
        return $this->belongsTo(Dieteticien::class, 'ID_DIETETICIEN', 'ID_DIETETICIEN');
    }

    public function menu_standard() {
        return $this->hasOne(MenuStandard::class, 'ID_MENU', 'ID_MENU');
    }

    // public function menu_personnalise() {
    //     return $this->hasOne(MenuSpecialise::class, 'ID_MENU', 'ID_MENU');
    // }

    public function repas()
    {
        return $this->belongsToMany(Repas::class, 'menu_repas', 'ID_MENU', 'ID_REPAS');
    }
}
