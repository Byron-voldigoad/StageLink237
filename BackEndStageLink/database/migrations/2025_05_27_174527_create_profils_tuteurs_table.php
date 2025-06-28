<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfilsTuteursTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profils_tuteurs', function (Blueprint $table) {
            $table->bigIncrements('id_tuteur');
            $table->unsignedBigInteger('utilisateur_id');
            $table->text('bio')->nullable();
            $table->string('specialites', 255)->nullable();
            $table->decimal('tarif_horaire', 10, 2)->nullable();
            $table->integer('experience_annees')->nullable();
            $table->string('diplomes', 255)->nullable();
            $table->text('methodes_pedagogiques')->nullable();
            $table->text('adresse')->nullable();
            $table->text('qualifications')->nullable();
            $table->text('certifications')->nullable();
            $table->string('photo_profil', 255)->nullable();
            $table->boolean('disponible')->default(true);
            $table->decimal('note', 3, 2)->default(0);
            $table->timestamps();
            $table->foreign('utilisateur_id')->references('id_utilisateur')->on('utilisateurs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('profils_tuteurs');
    }
}
