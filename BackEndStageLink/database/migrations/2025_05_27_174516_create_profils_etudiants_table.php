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
            $table->unsignedBigInteger('id_utilisateur');
            $table->string('prenom', 255);
            $table->string('nom', 255);
            $table->string('telephone', 20)->nullable();
            $table->text('adresse')->nullable();
            $table->string('ecole', 255)->nullable();
            $table->string('niveau', 100)->nullable();
            $table->string('domaine_etude', 255)->nullable();
            $table->string('cv_path', 255)->nullable();
            $table->string('photo_profil', 255)->nullable();
            $table->decimal('credits', 10, 2)->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            $table->foreign('id_utilisateur')->references('id_utilisateur')->on('utilisateurs')->onDelete('cascade');
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
