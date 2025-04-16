<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('manuals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('calculation_formula_id');
            $table->foreign('calculation_formula_id')->references('id')->on('calculation_formulas')->onDelete('cascade');
            $table->date('date_of_treatment');
            $table->date('date_formula')->nullable();

            $table->integer('actual_age')->nullable();
            $table->decimal('actual_weight', 5, 2)->nullable();

            $table->integer('day_care')->nullable();
            $table->integer('gestational_age')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manuals');
    }
};
