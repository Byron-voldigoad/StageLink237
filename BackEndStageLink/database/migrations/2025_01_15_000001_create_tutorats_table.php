<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTutoratsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tutorats', function (Blueprint $table) {
            $table->bigIncrements('id_tutorat');
            $table->string('titre', 255);
            $table->text('description');
            $table->string('domaine', 100);
            $table->string('niveau', 50);
            $table->dateTime('date_debut');
            $table->dateTime('date_fin');
            $table->unsignedBigInteger('tuteur_id');
            $table->string('localisation', 255)->nullable();
            $table->enum('statut', ['ouverte', 'pourvue', 'cloturee'])->default('ouverte');
            $table->decimal('tarif_horaire', 10, 2)->nullable();
            $table->integer('duree_seance')->nullable(); // en minutes
            $table->integer('nombre_seances')->nullable();
            $table->text('prerequis')->nullable();
            $table->text('objectifs')->nullable();
            $table->text('methode_pedagogique')->nullable();
            $table->timestamps();

            $table->foreign('tuteur_id')->references('id_tuteur')->on('profils_tuteurs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tutorats');
    }
} 