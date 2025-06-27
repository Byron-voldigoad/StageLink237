<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSujetsExamenTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sujets_examen', function (Blueprint $table) {
            $table->bigIncrements('id_sujet');
            $table->string('titre', 255);
            $table->unsignedBigInteger('id_matiere');
            $table->unsignedBigInteger('id_niveau');
            $table->unsignedBigInteger('id_annee');
            $table->string('fichier_path', 255)->nullable();
            $table->boolean('est_gratuit')->default(false);
            $table->decimal('prix', 10, 2)->default(0);
            $table->unsignedBigInteger('id_upload_par')->nullable();
            $table->boolean('approuve')->default(false);
            $table->integer('telechargements')->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();
            $table->foreign('id_matiere')->references('id_matiere')->on('matieres');
            $table->foreign('id_niveau')->references('id_niveau')->on('niveaux');
            $table->foreign('id_annee')->references('id_annee')->on('annees_academiques');
            $table->foreign('id_upload_par')->references('id_utilisateur')->on('utilisateurs')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sujets_examen');
    }
}
