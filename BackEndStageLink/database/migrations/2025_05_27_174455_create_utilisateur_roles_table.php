<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUtilisateurRolesTable extends Migration
{
    public function up()
    {
        Schema::create('utilisateur_roles', function (Blueprint $table) {
            $table->unsignedBigInteger('utilisateur_id');
            $table->unsignedBigInteger('role_id');
            $table->primary(['utilisateur_id', 'role_id']);
            $table->timestamps();
            $table->foreign('utilisateur_id')->references('id_utilisateur')->on('utilisateurs')->onDelete('cascade');
            $table->foreign('role_id')->references('id_role')->on('roles')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('utilisateur_roles');
    }
}
