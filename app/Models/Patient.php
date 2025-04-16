<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $guarded = [];


    public function doctor(){
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public static function validation($act = 'create', $id = null){
        return [
            'name' => 'required|string|max:255',
            'medical_record_number' => 'required|max:255|unique:patients,medical_record_number' . ($act == 'update' ? ",$id" : ''),
            'date_of_birth' => 'required|date',
        ];
    }
}
