<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Region extends Model
{
    protected $table = 'region';

    protected $primaryKey = 'id_r';

    public $timestamps = false;

    public function getRouteKeyName(): string
    {
        return 'id_r';
    }

    protected $fillable = [
        'nom',
        'adresse',
        'id_dr',
    ];

    public function directeurRegional(): BelongsTo
    {
        return $this->belongsTo(DirecteurRegional::class, 'id_dr', 'id_dr');
    }

    public function chauffeurs(): HasMany
    {
        return $this->hasMany(Chauffeur::class, 'id_r', 'id_r');
    }

    public function vehicules(): HasMany
    {
        return $this->hasMany(Vehicule::class, 'id_r', 'id_r');
    }
}
