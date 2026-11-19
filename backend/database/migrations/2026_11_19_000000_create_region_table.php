<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('region', function (Blueprint $table) {
            $table->id('id_r');
            $table->string('nom')->unique();
            $table->string('adresse');
            $table->unsignedBigInteger('id_dr')->nullable()->unique();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('region');
    }
};
