<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DirecteurGeneral extends Model
{
    protected $table = 'directeur_general';

    protected $primaryKey = 'id_dg';

    public $incrementing = false;

    public $timestamps = false;

    public function getRouteKeyName(): string
    {
        return 'id_dg';
    }

    protected $fillable = [
        'id_dg',
        'role',
    ];

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_dg', 'id_user');
    }
}
