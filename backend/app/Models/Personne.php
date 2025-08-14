<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Personne extends Model
{
    protected $table = "personne";

    protected $primaryKey = "ID_PERSONNE";

    protected $fillable = ['NOM', 'PRENOM', 'DATE_NAISSANCE', 'TELEPHONE', 'GENRE', 'EMAIL'];

    public $timestamps = false;

    public function utilisateur() {
        return $this->belongsTo(Utilisateur::class, 'ID_PERSONNE', 'ID_PERSONNE');
    }

    public function patient() {
        return $this->belongsTo(Personne::class, 'ID_PERSONNE', 'ID_PERSONNE');
    }

}
