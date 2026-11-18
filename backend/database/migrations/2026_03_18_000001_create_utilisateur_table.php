<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('utilisateur', function (Blueprint $table) {
            $table->increments('id_user');
            $table->string('nom', 50);
            $table->string('prenom', 50);
            $table->string('email', 100)->unique();
            $table->string('num', 15);
            $table->char('cin', 8)->unique();
            $table->string('adresse', 255)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('utilisateur');
    }
};
