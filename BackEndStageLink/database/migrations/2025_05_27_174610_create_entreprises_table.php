<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEntreprisesTable extends Migration
{
    public function up()
    {
        Schema::create('entreprises', function (Blueprint $table) {
            $table->id('id_entreprise');
            $table->foreignId('id_utilisateur')->nullable()->constrained('utilisateurs')->onDelete('cascade');
            $table->string('nom');
            $table->text('description')->nullable();
            $table->string('secteur')->nullable();
            $table->string('telephone', 20)->nullable();
            $table->string('adresse', 255)->nullable();
            $table->string('site_web')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('nif')->unique()->nullable();
            $table->boolean('verifie')->default(false);
            $table->string('quartier')->nullable();
            $table->string('email')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('entreprises');
    }
}
