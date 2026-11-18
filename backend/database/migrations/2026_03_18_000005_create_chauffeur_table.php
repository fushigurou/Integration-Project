<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chauffeur', function (Blueprint $table) {
            $table->increments('id_ch');
            $table->string('nom', 50);
            $table->string('prenom', 50);
            $table->string('email', 100)->unique();
            $table->string('num', 15);
            $table->char('cin', 8)->unique();
            $table->string('adresse', 255)->nullable();
            $table->unsignedInteger('id_r');
            $table->foreign('id_r')
                ->references('id_r')
                ->on('region')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chauffeur');
    }
};
