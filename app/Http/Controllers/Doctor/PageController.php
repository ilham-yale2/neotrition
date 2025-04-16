<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PageController extends Controller
{
    public function waitingRoom(){
        if (Auth::user()) {
            if (Auth::user()->login_status == 'login' || Auth::user()->role == 'admin') {
                return redirect()->route('dashboard');
            }
            return Inertia::render('doctor/WaitingRoom');
        }

        dd(Auth::user());
        abort(404);
    }
}
