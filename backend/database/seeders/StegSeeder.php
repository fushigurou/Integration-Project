<?php

namespace Database\Seeders;

use App\Models\Chauffeur;
use App\Models\DirecteurGeneral;
use App\Models\DirecteurRegional;
use App\Models\Region;
use App\Models\Utilisateur;
use App\Models\Vehicule;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StegSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            Vehicule::query()->delete();
            Chauffeur::query()->delete();
            Region::query()->delete();
            DirecteurRegional::query()->delete();
            DirecteurGeneral::query()->delete();
            Utilisateur::query()->delete();

            $dgUser = Utilisateur::create([
                'nom' => 'Ben Ali',
                'prenom' => 'Mohamed',
                'email' => 'dg@steg.tn',
                'num' => '71 000 000',
                'cin' => '00000001',
                'adresse' => 'Tunis',
            ]);
            DirecteurGeneral::create([
                'id_dg' => $dgUser->id_user,
                'role' => 'DG',
            ]);

            $drs = [
                [
                    'nom' => 'Ben Salah',
                    'prenom' => 'Karim',
                    'email' => 'dr.tunis@steg.tn',
                    'num' => '98 123 456',
                    'cin' => '07845123',
                    'adresse' => 'La Marsa, Tunis',
                    'region' => ['nom' => 'Tunis', 'adresse' => '38 Rue Kamel Ataturk, Tunis'],
                ],
                [
                    'nom' => 'Trabelsi',
                    'prenom' => 'Amel',
                    'email' => 'a.trabelsi@steg.tn',
                    'num' => '97 654 321',
                    'cin' => '08123456',
                    'adresse' => 'Sfax Ville',
                    'region' => ['nom' => 'Sfax', 'adresse' => 'Route de Gabès km 2, Sfax'],
                ],
                [
                    'nom' => 'Jlassi',
                    'prenom' => 'Sami',
                    'email' => 's.jlassi@steg.tn',
                    'num' => '55 210 987',
                    'cin' => '06778899',
                    'adresse' => 'Khezama, Sousse',
                    'region' => ['nom' => 'Sousse', 'adresse' => 'Avenue Léopold Sédar Senghor, Sousse'],
                ],
            ];

            $regionIds = [];
            foreach ($drs as $row) {
                $user = Utilisateur::create([
                    'nom' => $row['nom'],
                    'prenom' => $row['prenom'],
                    'email' => $row['email'],
                    'num' => $row['num'],
                    'cin' => $row['cin'],
                    'adresse' => $row['adresse'],
                ]);
                DirecteurRegional::create([
                    'id_dr' => $user->id_user,
                    'role' => 'DR',
                ]);
                $region = Region::create([
                    'nom' => $row['region']['nom'],
                    'adresse' => $row['region']['adresse'],
                    'id_dr' => $user->id_user,
                ]);
                $regionIds[$row['region']['nom']] = $region->id_r;
            }

            $vehicles = [
                ['matricule' => '215 TUN 4521', 'marque' => 'Peugeot Partner', 'region' => 'Tunis', 'etat' => 'AVAILABLE'],
                ['matricule' => '198 TUN 7710', 'marque' => 'Renault Kangoo', 'region' => 'Tunis', 'etat' => 'ON_MISSION'],
                ['matricule' => '224 TUN 1033', 'marque' => 'Isuzu D-Max', 'region' => 'Tunis', 'etat' => 'AVAILABLE'],
                ['matricule' => '176 TUN 9082', 'marque' => 'Citroën Berlingo', 'region' => 'Tunis', 'etat' => 'UNDER_MAINTENANCE'],
                ['matricule' => '230 TUN 3345', 'marque' => 'Toyota Hilux', 'region' => 'Sfax', 'etat' => 'AVAILABLE'],
                ['matricule' => '211 TUN 6620', 'marque' => 'Dacia Dokker', 'region' => 'Sfax', 'etat' => 'AVAILABLE'],
                ['matricule' => '207 TUN 5518', 'marque' => 'Fiat Doblo', 'region' => 'Sousse', 'etat' => 'ON_MISSION'],
            ];
            foreach ($vehicles as $v) {
                Vehicule::create([
                    'matricule' => $v['matricule'],
                    'marque' => $v['marque'],
                    'etat' => $v['etat'],
                    'id_r' => $regionIds[$v['region']],
                ]);
            }

            $drivers = [
                ['nom' => 'Mansouri', 'prenom' => 'Youssef', 'adresse' => 'Ariana', 'cin' => '09123456', 'email' => 'y.mansouri@steg.tn', 'num' => '22 456 789', 'region' => 'Tunis'],
                ['nom' => 'Gharbi', 'prenom' => 'Nabil', 'adresse' => 'Ben Arous', 'cin' => '09234567', 'email' => 'n.gharbi@steg.tn', 'num' => '23 111 222', 'region' => 'Tunis'],
                ['nom' => 'Hamdi', 'prenom' => 'Slim', 'adresse' => 'Radès', 'cin' => '09345678', 'email' => 's.hamdi@steg.tn', 'num' => '24 333 444', 'region' => 'Tunis'],
                ['nom' => 'Bouzid', 'prenom' => 'Mehdi', 'adresse' => 'Sfax Sud', 'cin' => '09456789', 'email' => 'm.bouzid@steg.tn', 'num' => '25 555 666', 'region' => 'Sfax'],
                ['nom' => 'Karray', 'prenom' => 'Walid', 'adresse' => 'Msaken', 'cin' => '09567890', 'email' => 'w.karray@steg.tn', 'num' => '26 777 888', 'region' => 'Sousse'],
            ];
            foreach ($drivers as $d) {
                Chauffeur::create([
                    'nom' => $d['nom'],
                    'prenom' => $d['prenom'],
                    'adresse' => $d['adresse'],
                    'cin' => $d['cin'],
                    'email' => $d['email'],
                    'num' => $d['num'],
                    'id_r' => $regionIds[$d['region']],
                ]);
            }
        });
    }
}
