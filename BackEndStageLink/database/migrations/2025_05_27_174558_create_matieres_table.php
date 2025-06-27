<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMatieresTable extends Migration
{
    public function up()
    {
        Schema::create('matieres', function (Blueprint $table) {
            $table->bigIncrements('id_matiere');
            $table->string('nom', 255);
            $table->text('description')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('matieres');
    }
}
