<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDisponibiliteToProfilsTuteursTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profils_tuteurs', function (Blueprint $table) {
            $table->text('disponibilite')->nullable()->after('disponible');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('profils_tuteurs', function (Blueprint $table) {
            $table->dropColumn('disponibilite');
        });
    }
}
