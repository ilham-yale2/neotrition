<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\CalculationFormula;
use App\Models\Individualized;
use App\Models\Manual;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CalculationFormulaController extends Controller
{
    public function index(){
        $data = CalculationFormula::query()
        ->where('doctor_id', Auth::user()->id)
        ->orderBy('created_at', 'desc');

        $data = parsingDataTable([
            [
                'name' => 'method',
                'render' => function($row){
                    return ucfirst($row->method);
                }
            ],
            [
                'name' => 'name',
                'render' => function($row) {
                    return $row->patient->name;
                }
            ],
            [
                'name' => 'timestamp',
                'render' => function ($row) {
                    return Carbon::parse($row->created_at)->format('d M Y');
                }
            ],
            [
                'name' => 'medical_record_number',
                'render' => function($row) {
                    return $row->patient->medical_record_number;
                }
            ],
        ], $data);
        return Inertia::render('doctor/CalculationFormula/Index', [
            'data' => $data,
        ]);
    }

    public function create($method)
    {
        if (!in_array($method, ['manual', 'individualized', 'starter', 'pg2'])) {
            abort(404);
        }

        $patients = \App\Models\Patient::query()
            ->where('doctor_id', Auth::user()->id)
            ->orderBy('created_at', 'desc')
            ->get();


        return Inertia::render('doctor/CalculationFormula/' . $method . '/index', [
            'method' => $method,
            'patients' => collect($patients)->map(function ($patient) {
                return [
                    'value' => $patient->id,
                    'label' => $patient->medical_record_number,
                    'name' => $patient->name,
                    'date_of_birth' => $patient->date_of_birth,
                ];
            }),
        ]);
    }

    public function store(Request $request, $method)
    {
        // $keys = array_keys($request->all());
        // sort($keys);
        // $dump = [];

        // foreach ($keys as $key => $value) {
        //     $dump[$value] = $request->{"$value"};
        //   }
        //   dd($dump);

        $validated = $request->validate(
            ['medical_record_number' => 'required']
        );
        DB::beginTransaction();
        try {
            $calculation = new CalculationFormula();
            $calculation->method = $method;
            $calculation->doctor_id = Auth::user()->id;
            $calculation->patient_id = $request->medical_record_number;
            $calculation->time = $request->time;
            $calculation->save();

            $validated = $request->except(['medical_record_number','patient_name', 'date_of_birth', 'time']);
            $validated['calculation_formula_id'] = $calculation->id;
            if($method == 'individualized'){
                $data = Individualized::create($validated);
            }else if($method == 'manual'){
                $data = Manual::create($validated);
            }
            DB::commit();

            return redirect()->route('calculation-formula.index')->with('success', 'Calculation completed successfully.');

        } catch (\Throwable $th) {
            dd($th->getMessage());
            return redirect()->route('calculation-formula.index')->with('error', $th->getMessage());

        }


    }
}
