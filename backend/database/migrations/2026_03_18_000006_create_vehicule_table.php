<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicule', function (Blueprint $table) {
            $table->increments('id_v');
            $table->string('matricule', 20)->unique();
            $table->string('marque', 50);
            $table->enum('etat', [
                'AVAILABLE',
                'ON_MISSION',
                'UNDER_MAINTENANCE',
                'UNAVAILABLE',
            ])->default('AVAILABLE');
            $table->unsignedInteger('id_r');
            $table->foreign('id_r')
                ->references('id_r')
                ->on('region')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicule');
    }
};
