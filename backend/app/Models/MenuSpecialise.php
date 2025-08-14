<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuSpecialise extends Model
{
    protected $table = 'menu_personnalise';

    protected $primaryKey = 'ID_MENU_PERSONNALISE';

    protected $fillable = [
        'ID_MENU',
        'ID_PATIENT'
    ];

    public $timestamps = false;
    
    public function patient() {
        return $this->belongsTo(Patient::class, 'ID_PATIENT', 'ID_PATIENT');
    }

    public function menu() {
        return $this->belongsTo(Menu::class, 'ID_MENU', 'ID_MENU');
    }
}
