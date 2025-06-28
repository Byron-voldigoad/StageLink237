<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLanguesTable extends Migration
{
    public function up()
    {
        Schema::create('langues', function (Blueprint $table) {
            $table->bigIncrements('id_langue');
            $table->string('nom', 100);
            $table->string('code', 10)->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('langues');
    }
}
