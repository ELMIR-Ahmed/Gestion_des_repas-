<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lit extends Model
{
    protected $table = 'lit';

    protected $primaryKey = 'ID_LIT';

    protected $fillable = [
        'NUM_LIT',
        'ID_SALLE'
    ];

    public $timestamps = false;

    public function salle() {
        return $this->belongsTo(Salle::class, 'ID_SALLE', 'ID_SALLE');
    }

    public function patient() {
        return $this->belongsTo(Patient::class, 'ID_LIT', 'ID_LIT');
    }
}
