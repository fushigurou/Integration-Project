<?php

namespace Database\Seeders;

use App\Models\DirecteurGeneral;
use App\Models\DirecteurRegional;
use App\Models\Utilisateur;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StegSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            DirecteurRegional::query()->delete();
            DirecteurGeneral::query()->delete();
            Utilisateur::query()->delete();

            $password = 'steg1234';

            $dgUser = Utilisateur::create([
                'nom' => 'Ben Ali',
                'prenom' => 'Mohamed',
                'email' => 'dg@steg.tn',
                'password' => $password,
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
                    'nom_region' => 'Tunis',
                ],
                [
                    'nom' => 'Trabelsi',
                    'prenom' => 'Amel',
                    'email' => 'a.trabelsi@steg.tn',
                    'num' => '97 654 321',
                    'cin' => '08123456',
                    'adresse' => 'Sfax Ville',
                    'nom_region' => 'Sfax',
                ],
                [
                    'nom' => 'Jlassi',
                    'prenom' => 'Sami',
                    'email' => 's.jlassi@steg.tn',
                    'num' => '55 210 987',
                    'cin' => '06778899',
                    'adresse' => 'Khezama, Sousse',
                    'nom_region' => 'Sousse',
                ],
            ];

            foreach ($drs as $row) {
                $user = Utilisateur::create([
                    'nom' => $row['nom'],
                    'prenom' => $row['prenom'],
                    'email' => $row['email'],
                    'password' => $password,
                    'num' => $row['num'],
                    'cin' => $row['cin'],
                    'adresse' => $row['adresse'],
                ]);
                DirecteurRegional::create([
                    'id_dr' => $user->id_user,
                    'role' => 'DR',
                    'nom_region' => $row['nom_region'],
                ]);
            }
        });
    }
}
