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
        Schema::create('starters', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('calculation_formula_id');
            $table->foreign('calculation_formula_id')->references('id')->on('calculation_formulas')->onDelete('cascade');
            $table->decimal('actual_age', 5, 2)->nullable();
            $table->decimal('actual_weight', 5, 2)->nullable();
            $table->decimal('calcium', 8, 2)->nullable();
            $table->decimal('calculated_fluid_volume', 8, 2)->nullable();
            $table->decimal('calculated_formula', 8,2)->nullable();
            $table->decimal('chloride', 8, 2)->nullable();
            $table->string('clinical_sensation')->nullable();
            $table->json('correction_continue_correction_rate')->nullable();
            $table->json('correction_continue_dilution')->nullable();
            $table->json('correction_continue_duration')->nullable();
            $table->json('correction_continue_target')->nullable();
            $table->string('correction_continue_total_fluid')->nullable();
            $table->json('correction_continue_total_volume')->nullable();
            $table->json('correction_intermitten_daily_total')->nullable();
            $table->json('correction_intermitten_dilution')->nullable();
            $table->json('correction_intermitten_frequence')->nullable();
            $table->json('correction_intermitten_need')->nullable();
            $table->decimal('creatinine', 8, 2)->nullable();
            $table->decimal('current_temperature', 5, 2)->nullable();
            $table->decimal('daily_balance', 8, 2)->nullable();
            $table->decimal('daily_balance_volume', 8, 2)->nullable();
            $table->date('date_formula')->nullable();
            $table->date('date_of_treatment')->nullable();
            $table->decimal('day_care', 3, 0)->nullable();
            $table->json('dextrose')->nullable();
            $table->decimal('fluid_volume_per_day', 8, 2)->nullable();
            $table->decimal('formula_warning_balance_estimate', 8,2)->nullable();
            $table->decimal('formula_warning_balance_volume', 8,2)->nullable();
            $table->decimal('formula_warning_electrolyte_daily_dose', 8,2)->nullable();
            $table->decimal('formula_warning_electrolyte_estimate', 8,2)->nullable();
            $table->json('formula_warning_note')->nullable();
            $table->string('formula_warning_total_volume_note')->nullable();
            $table->decimal('gestational_age', 5, 2)->nullable();
            $table->decimal('glucose', 8, 2)->nullable();
            $table->decimal('hemoglobin', 8, 2)->nullable();
            $table->decimal('humidity_incubator', 3, 0)->nullable();
            $table->decimal('infant_warmer', 3, 0)->nullable();
            $table->decimal('infant_wrapping', 3, 0)->nullable();
            $table->decimal('input_fluid', 8, 2)->nullable();
            $table->string('input_fluid_volume')->nullable();
            $table->decimal('insensible_water_loss', 8, 2)->nullable();
            $table->string('insensible_water_loss_volume')->nullable();
            $table->decimal('kalium', 8, 2)->nullable();
            $table->decimal('magnesium', 8, 2)->nullable();
            $table->decimal('natrium', 8, 2)->nullable();
            $table->json('non_dextrose_name')->nullable();
            $table->string('non_dextrose_total')->nullable();
            $table->json('non_dextrose_volume')->nullable();
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
            $table->string('other_transfusion_total')->nullable();
            $table->decimal('output_fluid', 8, 2)->nullable();
            $table->string('output_fluid_volume')->nullable();
            $table->json('parental_daily')->nullable();
            $table->json('parental_name')->nullable();
            $table->json('parental_need')->nullable();
            $table->string('parental_rate_continue')->nullable();
            $table->string('parental_total')->nullable();
            $table->json('pg_estimate')->nullable();
            $table->json('pg_needs')->nullable();
            $table->json('pg_total')->nullable();
            $table->json('pg_volume')->nullable();
            $table->decimal('phosphate', 8, 2)->nullable();
            $table->decimal('phototherapy', 3, 0)->nullable();
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
            $table->decimal('time_calculation', 3, 0)->nullable();
            $table->decimal('total_fluid_continue', 8, 2)->nullable();
            $table->decimal('total_fluid_intermitten', 8, 2)->nullable();
            $table->string('total_fluid_volume')->nullable();
            $table->decimal('ureum', 8, 2)->nullable();
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
        Schema::dropIfExists('starters');
    }
};
