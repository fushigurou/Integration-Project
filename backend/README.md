# STEG Missions — Backend (Laravel)

API CRUD for regions, vehicles, chauffeurs, and directors.

## Setup

1. Create the MySQL database (or run the SQL schema yourself):

```sql
CREATE DATABASE IF NOT EXISTS steg_missions
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

2. Credentials in `.env` (XAMPP MySQL on this machine uses port **3308**):

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3308
DB_DATABASE=steg_missions
DB_USERNAME=root
DB_PASSWORD=
```

3. Install & migrate:

```bash
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

API base URL: `http://127.0.0.1:8000/api`

## Endpoints

| Resource | Path |
|----------|------|
| Utilisateurs | `/api/utilisateurs` |
| Directeurs généraux | `/api/directeurs-generaux` |
| Directeurs régionaux | `/api/directeurs-regionaux` |
| Régions | `/api/regions` |
| Chauffeurs | `/api/chauffeurs` |
| Véhicules | `/api/vehicules` |

Each resource supports: `GET`, `POST`, `GET /{id}`, `PUT/PATCH /{id}`, `DELETE /{id}`.

CORS allows `http://127.0.0.1:5173` and `http://localhost:5173`.
