<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalculationFormula extends Model
{
    protected $guarded = ['id'];

    protected $appends = ['data_formula'];

    public function patient(){
        return $this->belongsTo(Patient::class);
    }

    public function manual()
    {
        return $this->hasOne(Manual::class);
    }

    public function individualized()
    {
        return $this->hasOne(Individualized::class);
    }

    public function starter()
    {
        return $this->hasOne(Starter::class);
    }

    public function parentalGlucose()
    {
        return $this->hasOne(ParentalGlucose::class);
    }

    public function getDataFormulaAttribute()
    {
    return match ($this->method) {
        'manual' => $this->manual,
        'individualized' => $this->individualized,
        'starter' => $this->starter,
        'pg2' => $this->parentalGlucose,
        default => null,
    };
}
}
