<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCandidaturesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('candidatures', function (Blueprint $table) {
            $table->bigIncrements('id_candidature');
            $table->unsignedBigInteger('id_offre_stage');
            $table->unsignedBigInteger('id_etudiant');
            $table->string('cv_path', 255);
            $table->string('lettre_motivation_path', 255)->nullable();
            $table->enum('statut', ['en_attente', 'examine', 'accepte', 'rejete'])->default('en_attente');
            $table->timestamp('postule_le')->useCurrent();
            $table->timestamp('mis_a_jour_le')->useCurrent()->useCurrentOnUpdate();
            $table->foreign('id_offre_stage')->references('id_offre_stage')->on('offres_stage')->onDelete('cascade');
            $table->foreign('id_etudiant')->references('id_etudiant')->on('profils_etudiants')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('candidatures');
    }
}
