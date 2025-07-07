<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('candidatures', function (Blueprint $table) {
            if (!Schema::hasColumn('candidatures', 'message_motivation')) {
                $table->text('message_motivation')->nullable()->after('id_etudiant');
            }
        });
    }

    public function down()
    {
        Schema::table('candidatures', function (Blueprint $table) {
            if (Schema::hasColumn('candidatures', 'message_motivation')) {
                $table->dropColumn('message_motivation');
            }
        });
    }
}; 