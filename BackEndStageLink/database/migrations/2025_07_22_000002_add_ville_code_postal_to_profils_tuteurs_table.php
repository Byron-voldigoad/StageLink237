<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('profils_tuteurs', function (Blueprint $table) {
            $table->string('ville', 100)->nullable()->after('adresse');
            $table->string('code_postal', 20)->nullable()->after('ville');
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
            $table->dropColumn(['ville', 'code_postal']);
        });
    }
}; 