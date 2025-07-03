<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSecteursTable extends Migration
{
    public function up()
    {
        Schema::create('secteurs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nom', 100)->unique();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('secteurs');
    }
} 