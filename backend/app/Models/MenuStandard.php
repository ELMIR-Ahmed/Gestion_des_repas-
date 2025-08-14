<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuStandard extends Model
{
    use HasFactory;

    protected $table = 'menu_standard';

    protected $primaryKey = 'ID_MENU_STANDARD';

    public $timestamps = false;

    protected $fillable = [
        'ID_MENU'
    ];

    /**
     * Get the menu that owns the MenuStandard.
     */
    public function menu()
    {
        return $this->belongsTo(Menu::class, 'ID_MENU', 'ID_MENU');
    }
}
