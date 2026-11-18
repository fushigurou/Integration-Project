# STEG Missions

Application React + Laravel pour la gestion des **régions**, **véhicules**, **chauffeurs** et **directeurs** STEG.

## Frontend

```bash
npm install
npm run dev
```

### Rôles démo

Mot de passe : `steg1234`

| Rôle | Email |
|------|-------|
| Directeur Général | `dg@steg.tn` |
| Directeur Régional | `dr.tunis@steg.tn` |

## Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env   # if needed
# Fill MySQL credentials: DB_DATABASE=steg_missions
php artisan key:generate
php artisan migrate
php artisan serve
```

API base: `http://127.0.0.1:8000/api`
