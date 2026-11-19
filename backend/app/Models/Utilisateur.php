<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class Utilisateur extends Authenticatable implements JWTSubject
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
        'password',
        'num',
        'cin',
        'adresse',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [
            'role' => $this->authRole(),
            'email' => $this->email,
        ];
    }

    public function directeurGeneral(): HasOne
    {
        return $this->hasOne(DirecteurGeneral::class, 'id_dg', 'id_user');
    }

    public function directeurRegional(): HasOne
    {
        return $this->hasOne(DirecteurRegional::class, 'id_dr', 'id_user');
    }

    public function authRole(): ?string
    {
        $this->loadMissing(['directeurGeneral', 'directeurRegional']);

        if ($this->directeurGeneral) {
            return 'dg';
        }

        if ($this->directeurRegional) {
            return 'dr';
        }

        return null;
    }

    public function toAuthPayload(): ?array
    {
        $role = $this->authRole();
        if ($role === null) {
            return null;
        }

        return [
            'id' => (string) $this->id_user,
            'role' => $role,
            'name' => trim("{$this->prenom} {$this->nom}"),
            'email' => $this->email,
            'region' => $role === 'dr'
                ? ($this->directeurRegional?->nom_region)
                : null,
        ];
    }
}
