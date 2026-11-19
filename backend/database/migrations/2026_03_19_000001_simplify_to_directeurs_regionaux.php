<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('vehicule');
        Schema::dropIfExists('chauffeur');
        Schema::dropIfExists('region');

        if (! Schema::hasColumn('directeur_regional', 'nom_region')) {
            Schema::table('directeur_regional', function (Blueprint $table) {
                $table->string('nom_region', 50)->nullable()->after('role');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('directeur_regional', 'nom_region')) {
            Schema::table('directeur_regional', function (Blueprint $table) {
                $table->dropColumn('nom_region');
            });
        }
    }
};
