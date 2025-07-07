<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMessageMotivationToCandidaturesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('candidatures', function (Blueprint $table) {
            $table->text('message_motivation')->nullable()->after('lettre_motivation_path');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('candidatures', function (Blueprint $table) {
            $table->dropColumn('message_motivation');
        });
    }
}
