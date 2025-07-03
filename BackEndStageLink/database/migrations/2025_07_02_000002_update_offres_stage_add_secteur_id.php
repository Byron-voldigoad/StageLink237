<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateOffresStageAddSecteurId extends Migration
{
    public function up()
    {
        Schema::table('offres_stage', function (Blueprint $table) {
            $table->unsignedBigInteger('secteur_id')->nullable()->after('id_entreprise');
            $table->foreign('secteur_id')->references('id')->on('secteurs')->onDelete('set null');
            // Optionnel : $table->dropColumn('secteur');
        });
    }

    public function down()
    {
        Schema::table('offres_stage', function (Blueprint $table) {
            $table->dropForeign(['secteur_id']);
            $table->dropColumn('secteur_id');
            // Optionnel : $table->string('secteur')->nullable();
        });
    }
} 