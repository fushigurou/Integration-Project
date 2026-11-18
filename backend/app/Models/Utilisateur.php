<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Utilisateur extends Model
{
    protected $table = 'utilisateur';

    protected $primaryKey = 'id_user';

    public $timestamps = false;

    public function getRouteKeyName(): string
    {
        return 'id_user';
    }

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'num',
        'cin',
        'adresse',
    ];

    public function directeurGeneral(): HasOne
    {
        return $this->hasOne(DirecteurGeneral::class, 'id_dg', 'id_user');
    }

    public function directeurRegional(): HasOne
    {
        return $this->hasOne(DirecteurRegional::class, 'id_dr', 'id_user');
    }
}
