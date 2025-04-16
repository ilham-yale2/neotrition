<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Individualized extends Model
{
    protected $casts = [
        'correction_continue_correction_rate' => 'array',
        'correction_continue_dilution' => 'array',
        'correction_continue_duration' => 'array',
        'correction_continue_target' => 'array',
        'correction_continue_total_volume' => 'array',
        'correction_intermitten_daily_total' => 'array',
        'correction_intermitten_dilution' => 'array',
        'correction_intermitten_frequence' => 'array',
        'correction_intermitten_need' => 'array',
        'dextrose' => 'array',
        'formula_warning_note' => 'array',
        'non_dextrose_name' => 'array',
        'non_dextrose_need' => 'array',
        'non_dextrose_total' => 'array',
        'nutrition_calories' => 'array',
        'nutrition_interval' => 'array',
        'nutrition_name' => 'array',
        'nutrition_need' => 'array',
        'nutrition_total' => 'array',
        'nutrition_volume' => 'array',
        'other_transfusion_amount_transfusion' => 'array',
        'other_transfusion_duration' => 'array',
        'other_transfusion_name' => 'array',
        'other_transfusion_need' => 'array',
        'other_transfusion_rate' => 'array',
        'parental_daily' => 'array',
        'parental_name' => 'array',
        'parental_need' => 'array',
        'pg_total' => 'array',
        'pg_volume' => 'array',
        'prc_transfusion_amount_transfusion' => 'array',
        'prc_transfusion_duration' => 'array',
        'prc_transfusion_hb_target' => 'array',
        'prc_transfusion_rate' => 'array',
        'prc_transfusion_ratio' => 'array',
        'setup_continue_duration' => 'array',
        'setup_continue_name' => 'array',
        'setup_continue_rate' => 'array',
        'setup_continue_total_fluid' => 'array',
        'setup_intermitten_frequency' => 'array',
        'setup_intermitten_name' => 'array',
        'setup_intermitten_need' => 'array',
        'setup_intermitten_total_fluid' => 'array',
        'warning_nutrition_formula' => 'array',
        'warning_nutrition_note' => 'array',
    ];


    protected $guarded = ['id'];
}
