<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSoumissionsEtudiantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('soumissions_etudiants', function (Blueprint $table) {
            $table->bigIncrements('id_soumission');
            $table->unsignedBigInteger('id_etudiant');
            $table->string('titre', 255);
            $table->unsignedBigInteger('id_matiere');
            $table->unsignedBigInteger('id_niveau');
            $table->unsignedBigInteger('id_annee');
            $table->string('fichier_path', 255);
            $table->enum('statut', ['en_attente', 'approuve', 'rejete'])->default('en_attente');
            $table->text('commentaire_admin')->nullable();
            $table->decimal('credits_accordes', 10, 2)->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('id_etudiant')->references('id_etudiant')->on('profils_etudiants')->onDelete('cascade');
            $table->foreign('id_matiere')->references('id_matiere')->on('matieres');
            $table->foreign('id_niveau')->references('id_niveau')->on('niveaux');
            $table->foreign('id_annee')->references('id_annee')->on('annees_academiques');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('soumissions_etudiants');
    }
}
