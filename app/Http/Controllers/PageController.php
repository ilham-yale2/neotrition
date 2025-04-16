<?php

namespace App\Http\Controllers;

use App\Models\CalculationFormula;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PageController extends Controller
{
    public function welcome(){
        return Inertia::render('client/Welcome');
    }

    public function patientData(){
        return Inertia::render('client/PatientData');
    }

    public function patientForm(){
        return Inertia::render('client/PatientForm');
    }

    public function dashboard(){
        $data = [];

        if(Auth::user()->role == 'admin'){
            $data['doctors'] = DB::table('users')->select('id', 'name')->where('role', 'doctor')->get();
            $data['patients'] = DB::table('patients')->select('id', 'name')->get();
            $data['calculation_formulas'] = DB::table('calculation_formulas')->select('id')->get();
            $data['requested_login'] = DB::table('users')->select('id', 'name', 'role', 'login_status')->where('role', 'doctor')->where('role', 'doctor')->where('login_status', 'requested')->get();
        }

        return Inertia::render('Dashboard', [
            'data' => $data
        ]);
    }
}
