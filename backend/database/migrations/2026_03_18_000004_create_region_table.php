<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('region', function (Blueprint $table) {
            $table->increments('id_r');
            $table->string('nom', 50)->unique();
            $table->string('adresse', 255)->nullable();
            $table->unsignedInteger('id_dr')->nullable()->unique();
            $table->foreign('id_dr')
                ->references('id_dr')
                ->on('directeur_regional')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('region');
    }
};
