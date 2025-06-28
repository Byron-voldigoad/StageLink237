<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTuteurLanguesTable extends Migration
{
    public function up()
    {
        Schema::create('tuteur_langues', function (Blueprint $table) {
            $table->bigIncrements('id_tuteur_langue');
            $table->unsignedBigInteger('tuteur_id');
            $table->unsignedBigInteger('langue_id');
            $table->timestamps();
            $table->foreign('tuteur_id')->references('id_tuteur')->on('profils_tuteurs')->onDelete('cascade');
            $table->foreign('langue_id')->references('id_langue')->on('langues')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('tuteur_langues');
    }
}
