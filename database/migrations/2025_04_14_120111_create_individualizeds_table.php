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
        Schema::create('individualizeds', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('calculation_formula_id');
            $table->foreign('calculation_formula_id')->references('id')->on('calculation_formulas')->onDelete('cascade');
            $table->integer('actual_age')->nullable();
            $table->decimal('actual_weight',5,2)->nullable();
            $table->integer('calcium')->nullable();
            $table->integer('chloride')->nullable();
            $table->decimal('clinical_sensation', 10, 2)->nullable();
            $table->json('correction_continue_correction_rate')->nullable();
            $table->json('correction_continue_dilution')->nullable();
            $table->json('correction_continue_duration')->nullable();
            $table->json('correction_continue_target')->nullable();
            $table->decimal('correction_continue_total_fluid', 10, 2)->nullable();
            $table->json('correction_continue_total_volume')->nullable();
            $table->json('correction_intermitten_daily_total')->nullable();
            $table->json('correction_intermitten_dilution')->nullable();
            $table->json('correction_intermitten_frequence')->nullable();
            $table->json('correction_intermitten_need')->nullable();
            $table->integer('creatinine')->nullable();
            $table->integer('current_temperature')->nullable();
            $table->decimal('daily_balance', 10, 2)->nullable();
            $table->decimal('daily_balance_volume', 10, 2)->nullable();
            $table->date('date_formula')->nullable();
            $table->date('date_of_treatment')->nullable();
            $table->integer('day_care')->nullable();
            $table->json('dextrose')->nullable();

            $table->decimal('fluid_volume_per_day', 10, 2)->nullable();
            $table->decimal('formula_warning_balance_estimate', 10, 2)->nullable();
            $table->decimal('formula_warning_balance_volume', 10, 2)->nullable();
            $table->decimal('formula_warning_electrolyte_daily_dose', 10, 2)->nullable();
            $table->decimal('formula_warning_electrolyte_estimate', 10, 2)->nullable();
            $table->json('formula_warning_note')->nullable();
            $table->text('formula_warning_total_volume_note')->nullable();
            $table->integer('gestational_age')->nullable();
            $table->integer('glucose')->nullable();
            $table->integer('hemoglobin')->nullable();
            $table->integer('humidity_incubator')->nullable();
            $table->integer('infant_warmer')->nullable();
            $table->integer('infant_wrapping')->nullable();
            $table->integer('input_fluid')->nullable();
            $table->decimal('input_fluid_volume', 10, 2)->nullable();
            $table->decimal('insensible_water_loss', 10, 2)->nullable();
            $table->decimal('insensible_water_loss_volume', 10, 2)->nullable();
            $table->integer('kalium')->nullable();
            $table->integer('magnesium')->nullable();
            $table->integer('natrium')->nullable();
            $table->json('non_dextrose_name')->nullable();
            $table->json('non_dextrose_need')->nullable();
            $table->json('non_dextrose_total')->nullable();
            $table->json('nutrition_calories')->nullable();
            $table->json('nutrition_interval')->nullable();
            $table->json('nutrition_name')->nullable();
            $table->json('nutrition_need')->nullable();
            $table->json('nutrition_total')->nullable();
            $table->json('nutrition_volume')->nullable();
            $table->json('other_transfusion_amount_transfusion')->nullable();
            $table->json('other_transfusion_duration')->nullable();
            $table->json('other_transfusion_name')->nullable();
            $table->json('other_transfusion_need')->nullable();
            $table->json('other_transfusion_rate')->nullable();
            $table->decimal('other_transfusion_total', 10, 2)->nullable();
            $table->integer('output_fluid')->nullable();
            $table->decimal('output_fluid_volume', 10, 2)->nullable();
            $table->json('parental_daily')->nullable();
            $table->json('parental_name')->nullable();
            $table->json('parental_need')->nullable();
            $table->decimal('parental_rate_continue', 10, 2)->nullable();
            $table->decimal('parental_total', 10, 2)->nullable();
            $table->float('pg_rate_continue')->nullable();
            $table->json('pg_total')->nullable();
            $table->json('pg_volume')->nullable();
            $table->integer('phosphate')->nullable();
            $table->integer('phototherapy')->nullable();
            $table->json('prc_transfusion_amount_transfusion')->nullable();
            $table->json('prc_transfusion_duration')->nullable();
            $table->json('prc_transfusion_hb_target')->nullable();
            $table->json('prc_transfusion_rate')->nullable();
            $table->json('prc_transfusion_ratio')->nullable();
            $table->json('setup_continue_duration')->nullable();
            $table->json('setup_continue_name')->nullable();
            $table->json('setup_continue_rate')->nullable();
            $table->json('setup_continue_total_fluid')->nullable();
            $table->json('setup_intermitten_frequency')->nullable();
            $table->json('setup_intermitten_name')->nullable();
            $table->json('setup_intermitten_need')->nullable();
            $table->json('setup_intermitten_total_fluid')->nullable();
            $table->integer('time_calculation')->nullable();
            $table->integer('total_fluid_continue')->nullable();
            $table->integer('total_fluid_intermitten')->nullable();
            $table->decimal('total_fluid_volume', 10, 2)->nullable();
            $table->integer('ureum')->nullable();
            $table->json('warning_nutrition_formula')->nullable();
            $table->json('warning_nutrition_note')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('individualizeds');
    }
};
