<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pathologie extends Model
{
    protected $table = 'pathologie';

    protected $primaryKey = 'ID_PATHOLOGIE';

    protected $fillable = [
        "NOM_PATHOLOGIE"
    ];

    public $timestamps = false;

    public function patients() {
        return $this->belongsToMany(Patient::class, 'patient_pathologie', 'ID_PATHOLOGIE', 'ID_PATIENT');
    }
}
