<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTuteurMatieresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tuteur_matieres', function (Blueprint $table) {
            $table->bigIncrements('id_tuteur_matiere');
            $table->unsignedBigInteger('id_tuteur');
            $table->unsignedBigInteger('id_matiere');
            $table->string('niveau', 100);
            $table->foreign('id_tuteur')->references('id_tuteur')->on('profils_tuteurs')->onDelete('cascade');
            $table->foreign('id_matiere')->references('id_matiere')->on('matieres')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tuteur_matieres');
    }
}
