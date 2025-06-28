<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSeancesTutoratTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('seances_tutorat', function (Blueprint $table) {
            $table->bigIncrements('id_seance');
            $table->unsignedBigInteger('tutorat_id');
            $table->date('date_seance');
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->string('lieu', 255)->nullable();
            $table->enum('mode', ['presentiel', 'en_ligne', 'hybride'])->default('presentiel');
            $table->string('lien_visio', 255)->nullable();
            $table->enum('statut', ['planifiee', 'en_cours', 'terminee', 'annulee'])->default('planifiee');
            $table->text('notes_tuteur')->nullable();
            $table->text('notes_etudiant')->nullable();
            $table->text('materiel_requis')->nullable();
            $table->timestamps();

            $table->foreign('tutorat_id')->references('id_tutorat')->on('tutorats')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('seances_tutorat');
    }
} 