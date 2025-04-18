<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\FirebaseService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LoginRequestController extends Controller
{
    private $fb_database;
    private $fb_login_path;

    public function __construct()
    {
        $this->fb_database = FirebaseService::connect();
        if (env('VITE_APP_ENV') == 'local') {
            $this->fb_login_path = 'localLoginUser/';
        }else{
            $this->fb_login_path = 'loginUser/';
        }
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = User::query()
        ->where('login_status', 'requested')
        ->where('role', 'doctor')
        ->orderBy('created_at', 'desc');

        $doctors = parsingDataTable([
            [
                'name' => 'name',
            ],
            [
                'name' => 'email',
            ],
            [
                'name' => 'timestamp',
                'render' => function($row){
                    return Carbon::now()->diffInDays(Carbon::parse($row->updated_at)) > 1 ? $row->updated_at->format('d-m-Y') : Carbon::parse($row->updated_at)->diffForHumans();
                }
            ],
            [
                'name' => 'patient_count',
                'searchable' => false,
                'render' => function ($row) {
                   return $row->patients->count();
                }
            ]
        ], $data);
        return Inertia::render('admin/LoginRequest/Index', [
            'doctors' => $doctors,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $doctor)
    {
        DB::beginTransaction();
        try {
            $user = User::where('role', 'doctor')->where('id', $request->id)->firstOrFail();

            $user->login_status = 'login';
            $user->last_login = Carbon::now();
            $user->save();

            try {
                $this->fb_database
                    ->getReference($this->fb_login_path . $user->id . '/status')
                    ->set('login');
            } catch (\Throwable $th) {
                throw $th;
            }
            DB::commit();

            return redirect()->route('login-request.index')->with('success', 'Berhasil menyetujui Login.');
        } catch (\Throwable $th) {
            //throw $th;
            return redirect()->route('login-request.index')->with('error', $th->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
