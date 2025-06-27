<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCorrigesExamenTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('corriges_examen', function (Blueprint $table) {
            $table->bigIncrements('id_corrige');
            $table->unsignedBigInteger('id_sujet');
            $table->unsignedBigInteger('id_tuteur');
            $table->string('fichier_path', 255);
            $table->decimal('prix', 10, 2);
            $table->boolean('approuve')->default(false);
            $table->integer('telechargements')->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('id_sujet')->references('id_sujet')->on('sujets_examen')->onDelete('cascade');
            $table->foreign('id_tuteur')->references('id_tuteur')->on('profils_tuteurs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('corriges_examen');
    }
}
