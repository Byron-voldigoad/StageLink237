<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionsCreditsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions_credits', function (Blueprint $table) {
            $table->bigIncrements('id_transaction');
            $table->unsignedBigInteger('id_utilisateur');
            $table->decimal('montant', 10, 2);
            $table->enum('type', ['achat', 'recompense', 'retrait', 'revenu_correction']);
            $table->string('methode_paiement', 100)->nullable();
            $table->string('reference_transaction', 255)->nullable();
            $table->enum('statut', ['en_attente', 'complete', 'echoue'])->default('en_attente');
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('id_utilisateur')->references('id_utilisateur')->on('utilisateurs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transactions_credits');
    }
}
