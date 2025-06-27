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
        Schema::create('offres_stage', function (Blueprint $table) {
            $table->id('id_offre_stage');
            $table->foreignId('id_entreprise')->constrained('entreprises', 'id_entreprise')->onDelete('cascade');
            $table->string('titre');
            $table->text('description');
            $table->text('exigences')->nullable();
            $table->text('competences_requises')->nullable();
            $table->string('duree')->nullable();
            $table->date('date_debut')->nullable();
            $table->date('date_fin')->nullable();
            $table->string('localisation')->nullable();
            $table->decimal('remuneration', 10, 2)->nullable();
            $table->enum('secteur', [
                'developpement_web',
                'developpement_mobile',
                'intelligence_artificielle',
                'cybersecurite',
                'cloud_computing',
                'data_science',
                'reseaux',
                'systemes_embarques',
                'design_ui_ux',
                'gestion_de_projet'
            ])->nullable();
            $table->enum('statut', ['ouvert', 'ferme', 'en_attente'])->default('en_attente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('offres_stage');
    }
};
