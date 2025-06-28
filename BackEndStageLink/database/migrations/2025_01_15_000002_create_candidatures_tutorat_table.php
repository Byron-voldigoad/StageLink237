<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCandidaturesTutoratTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('candidatures_tutorat', function (Blueprint $table) {
            $table->bigIncrements('id_candidature');
            $table->unsignedBigInteger('tutorat_id');
            $table->unsignedBigInteger('etudiant_id');
            $table->enum('statut', ['en_attente', 'acceptee', 'refusee', 'annulee'])->default('en_attente');
            $table->text('message_motivation')->nullable();
            $table->string('cv_path', 255)->nullable();
            $table->string('lettre_motivation_path', 255)->nullable();
            $table->dateTime('date_candidature');
            $table->timestamps();

            $table->foreign('tutorat_id')->references('id_tutorat')->on('tutorats')->onDelete('cascade');
            $table->foreign('etudiant_id')->references('id_etudiant')->on('profils_etudiants')->onDelete('cascade');
            $table->unique(['tutorat_id', 'etudiant_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('candidatures_tutorat');
    }
} 