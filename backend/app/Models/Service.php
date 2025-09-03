<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $table = 'service';

    protected $primaryKey = "ID_SERVICE";

    protected $fillable = [
        'NOM_SERVICE',
        'DESCRIPTION'
    ];

    public $timestamps = false;


    public function salles() {
        return $this->hasMany(Salle::class, 'ID_SERVICE', 'ID_SERVICE');
    }

    public function menus_standard() {
        return $this->hasMany(MenuStandard::class, 'ID_SERVICE', 'ID_SERVICE');
    }

    public function distribution() {
        return $this->hasMany(Distribution::class, 'ID_SERVICE', 'ID_SERVICE');
    }

}
