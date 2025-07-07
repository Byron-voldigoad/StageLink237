<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSecteurIdToOffresStageTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('offres_stage', function (Blueprint $table) {
            // Vérifier si la colonne n'existe pas déjà
            if (!Schema::hasColumn('offres_stage', 'secteur_id')) {
                $table->unsignedBigInteger('secteur_id')->nullable()->after('remuneration');
            }
        });

        // Mettre à jour les enregistrements existants si nécessaire
        // Par exemple, pour migrer les données de l'ancienne colonne 'secteur' vers 'secteur_id'
        // Cette partie est optionnelle et dépend de votre logique métier
        // DB::table('offres_stage')->update([
        //     'secteur_id' => DB::raw('(SELECT id FROM secteurs WHERE nom = offres_stage.secteur LIMIT 1)')
        // ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('offres_stage', function (Blueprint $table) {
            $table->dropForeign(['secteur_id']);
            $table->dropColumn('secteur_id');
        });
    }
}
