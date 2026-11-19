<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    protected $table = 'region';

    protected $primaryKey = 'id_r';

    public $timestamps = false;

    protected $fillable = [
        'nom',
        'adresse',
        'id_dr',
    ];
}
