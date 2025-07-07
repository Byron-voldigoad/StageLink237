<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('candidatures', function (Blueprint $table) {
            if (!Schema::hasColumn('candidatures', 'created_at')) {
                $table->timestamp('created_at')->nullable();
            }
            if (!Schema::hasColumn('candidatures', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
        });
    }

    public function down()
    {
        Schema::table('candidatures', function (Blueprint $table) {
            if (Schema::hasColumn('candidatures', 'created_at')) {
                $table->dropColumn('created_at');
            }
            if (Schema::hasColumn('candidatures', 'updated_at')) {
                $table->dropColumn('updated_at');
            }
        });
    }
}; 