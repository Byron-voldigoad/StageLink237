<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfilsEtudiantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profils_etudiants', function (Blueprint $table) {
            $table->bigIncrements('id_etudiant');
            $table->unsignedBigInteger('utilisateur_id');
            $table->string('niveau_etude', 100)->nullable();
            $table->string('etablissement', 255)->nullable();
            $table->string('specialite', 255)->nullable();
            $table->text('objectifs')->nullable();
            $table->text('adresse')->nullable();
            $table->string('cv_path', 255)->nullable();
            $table->string('photo_profil', 255)->nullable();
            $table->decimal('credits', 10, 2)->default(0);
            $table->timestamps();
            $table->foreign('utilisateur_id')->references('id_utilisateur')->on('utilisateurs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('profils_etudiants');
    }
}
