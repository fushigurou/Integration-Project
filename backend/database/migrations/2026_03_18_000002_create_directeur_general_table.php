<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('directeur_general', function (Blueprint $table) {
            $table->unsignedInteger('id_dg')->primary();
            $table->string('role', 30)->default('DG');
            $table->foreign('id_dg')
                ->references('id_user')
                ->on('utilisateur')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('directeur_general');
    }
};
