<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Chauffeur extends Model
{
    protected $table = 'chauffeur';

    protected $primaryKey = 'id_ch';

    public $timestamps = false;

    public function getRouteKeyName(): string
    {
        return 'id_ch';
    }

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'num',
        'cin',
        'adresse',
        'id_r',
    ];

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class, 'id_r', 'id_r');
    }
}
