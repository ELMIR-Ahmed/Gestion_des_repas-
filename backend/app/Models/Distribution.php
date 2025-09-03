<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Distribution extends Model
{
    protected $table = 'distribution';

    protected $fillable = [
        "ID_DISTRIBUTEUR",
        "ID_SERVICE",
        "ID_REPAS",
        "DATE_DITRIBUTION",
        "DATE_FIN_DISTRIBUTION",
        "STATUT"
    ];

    protected $primaryKey = 'ID_DISTRIBUTION';

    public $timestamps = false;

    public function service() {
        return $this->belongsTo(Service::class, "ID_SERVICE", "ID_SERVICE");
    }

    public function patients() {
        return $this->belongsToMany(Patient::class, "distribution_patient", 'ID_DISTRIBUTION', 'ID_PATIENT');
    }

    public function repas() {
        return $this->belongsTo(Repas::class, 'ID_REPAS', 'ID_REPAS');   
    }
}
