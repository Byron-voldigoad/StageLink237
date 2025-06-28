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
            $table->unsignedBigInteger('tuteur_id');
            $table->unsignedBigInteger('matiere_id');
            $table->string('niveau', 100);
            $table->timestamps();
            $table->foreign('tuteur_id')->references('id_tuteur')->on('profils_tuteurs')->onDelete('cascade');
            $table->foreign('matiere_id')->references('id_matiere')->on('matieres')->onDelete('cascade');
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
