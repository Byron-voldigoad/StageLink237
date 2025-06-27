<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluationsTuteursTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluations_tuteurs', function (Blueprint $table) {
            $table->bigIncrements('id_evaluation');
            $table->unsignedBigInteger('id_tuteur');
            $table->unsignedBigInteger('id_etudiant');
            $table->integer('note');
            $table->text('commentaire')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('id_tuteur')->references('id_tuteur')->on('profils_tuteurs')->onDelete('cascade');
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
        Schema::dropIfExists('evaluations_tuteurs');
    }
}
