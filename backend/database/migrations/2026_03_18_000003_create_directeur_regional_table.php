<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('directeur_regional', function (Blueprint $table) {
            $table->unsignedInteger('id_dr')->primary();
            $table->string('role', 30)->default('DR');
            $table->foreign('id_dr')
                ->references('id_user')
                ->on('utilisateur')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('directeur_regional');
    }
};
