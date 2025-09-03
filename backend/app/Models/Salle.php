<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Salle extends Model
{
    protected $table = 'salle';

    protected $primaryKey = 'ID_SALLE';

    protected $fillable = [
        'ID_SERVICE',
        'NOM_SALLE'
    ];

    public $timestamps = false;


    public function service() {
        return $this->belongsTo(Service::class, 'ID_SERVICE', 'ID_SERVICE');
    }

    public function lits() {
        return $this->hasMany(Lit::class, 'ID_SALLE', 'ID_SALLE');
    }
}
