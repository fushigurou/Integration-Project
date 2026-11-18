<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vehicule extends Model
{
    protected $table = 'vehicule';

    protected $primaryKey = 'id_v';

    public $timestamps = false;

    public function getRouteKeyName(): string
    {
        return 'id_v';
    }

    protected $fillable = [
        'matricule',
        'marque',
        'etat',
        'id_r',
    ];

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class, 'id_r', 'id_r');
    }
}
