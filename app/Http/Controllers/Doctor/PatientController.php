<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PatientController extends Controller
{
    protected $model = \App\Models\Patient::class;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = $this->model::query()
        ->where('doctor_id', Auth::user()->id)
        ->orderBy('created_at', 'desc');

        $patients = parsingDataTable([
            [
                'name' => 'name',
            ],
            [
                'name' => 'date_of_birth',
                'render' => function ($row) {
                    return Carbon::parse($row->date_of_birth)->format('d M Y');
                }
            ],
            [
                'name' => 'medical_record_number',
            ],
            [
                'name' => 'doctor_name',
                'searchable' => false,
                'render' => function ($row) {
                   return $row->doctor->name;
                }
            ]
        ], $data);
        return Inertia::render('doctor/Patients/Index', [
            'patients' => $patients,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('doctor/Patients/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate(
            $this->model::validation()
        );

        try {
            DB::beginTransaction();
            $validated['doctor_id'] = Auth::user()->id;
            $patient = $this->model::create($validated);
            DB::commit();
            return redirect()->route('my-patients.index')->with('success', 'Patient created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error: ' . $e->getMessage());
        }


    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $patient = $this->model::findOrFail($id);
        return Inertia::render('doctor/Patients/Show', [
            'patient' => $patient,
        ]);
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
        DB::beginTransaction();
        try {
            $patient = $this->model::findOrFail($id);
            // $patient->delete();
            DB::commit();
            return redirect()->route('my-patients.index')->with('success', 'Patient deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error: ' . $e->getMessage());
        }
    }
}
