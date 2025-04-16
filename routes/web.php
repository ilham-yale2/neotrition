<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function(){
    return redirect('/login');
})->name('home');
Route::post('/patient-data', [App\Http\Controllers\PageController::class, 'patientData'])->name('patientData');
Route::get('/patient-form', [App\Http\Controllers\PageController::class, 'patientForm'])->name('patientForm');

Route::group(['middleware' => ['auth', 'admin']], function () {
    Route::get('/doctors', [App\Http\Controllers\Admin\DoctorController::class, 'index'])->name('doctor.index');
    Route::get('/login-request', [App\Http\Controllers\Admin\LoginRequestController::class, 'index'])->name('login-request.index');
    Route::post('/login-request/{doctor}', [App\Http\Controllers\Admin\LoginRequestController::class, 'store'])->name('login-request.store');
});


Route::get('/waiting-room', [App\Http\Controllers\Doctor\PageController::class, 'waitingRoom'])->middleware('auth')->name('waiting-room');
Route::group(['middleware' => ['auth', 'doctor', 'grantedLogin']], function () {

    Route::resource('/my-patients', App\Http\Controllers\Doctor\PatientController::class);
    Route::get('/calculation-formula', [App\Http\Controllers\Doctor\CalculationFormulaController::class, 'index'])->name('calculation-formula.index');
    Route::get('/calculation-formula/{method}', [App\Http\Controllers\Doctor\CalculationFormulaController::class, 'create'])->name('calculation-formula.create');
    Route::get('/calculation-formula-show/{id}', [App\Http\Controllers\Doctor\CalculationFormulaController::class, 'show'])->name('calculation-formula.show');
    Route::post('/calculation-formula/{method}', [App\Http\Controllers\Doctor\CalculationFormulaController::class, 'store'])->name('calculation-formula.store');
});

Route::get('dashboard', [\App\Http\Controllers\PageController::class, 'dashboard'])->middleware(['auth', 'verified', 'grantedLogin'])->name('dashboard');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
