<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DirecteurRegional extends Model
{
    protected $table = 'directeur_regional';

    protected $primaryKey = 'id_dr';

    public $incrementing = false;

    public $timestamps = false;

    public function getRouteKeyName(): string
    {
        return 'id_dr';
    }

    protected $fillable = [
        'id_dr',
        'role',
        'nom_region',
    ];

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_dr', 'id_user');
    }
}
