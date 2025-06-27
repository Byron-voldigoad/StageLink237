<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTypeToSujetsExamenTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sujets_examen', function (Blueprint $table) {
            $table->unsignedBigInteger('id_type')->nullable()->after('id_annee');
            $table->foreign('id_type')->references('id_type')->on('types_sujets')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sujets_examen', function (Blueprint $table) {
            $table->dropForeign(['id_type']);
            $table->dropColumn('id_type');
        });
    }
} 