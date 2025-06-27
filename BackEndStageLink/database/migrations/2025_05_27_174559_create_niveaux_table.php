<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNiveauxTable extends Migration
{
    public function up()
    {
        Schema::create('niveaux', function (Blueprint $table) {
            $table->bigIncrements('id_niveau');
            $table->string('nom', 100);
            $table->text('description')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('niveaux');
    }
}
