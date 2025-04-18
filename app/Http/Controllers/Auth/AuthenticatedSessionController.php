<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Services\FirebaseService;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    private $fb_database;
    private $fb_login_path;

    public function __construct()
    {
        $this->fb_database = FirebaseService::connect();
        if (env('APP_ENV') == 'local') {
            $this->fb_login_path = 'localLoginUser/';
        }else{
            $this->fb_login_path = 'loginUser/';
        }
    }
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();
        if ($user->role == 'doctor') {
            $user->login_status = 'requested';
            $user->save();

           try {
            $this->fb_database
            ->getReference($this->fb_login_path . $user->id)
            ->set([
                'email' => $user->email,
                'status' => 'requested',
                'name' => $user->name,
            ]);
           } catch (\Throwable $th) {
            throw $th;
           }

            return redirect()->intended(route('waiting-room', absolute: false));
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
