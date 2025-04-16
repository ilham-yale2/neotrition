<script lang="ts" setup>
import { safeDivide } from '@/lib/utils';
import { computed } from 'vue';

    const props = defineProps({
        form: {
            type: Object,
            required: true,
        },
    });

    const form = props.form

    const formatter = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    interface HeaderPersonalData {
        title: string;
        value: string;
    }

    const headPersonalData: HeaderPersonalData[] = [
        {
            title: 'Nama Pasien',
            value: form['patient_name'],
        },
        {
            title: 'Nomor Rekam Medis',
            value: form['medical_record_number'],
        },
        {
            title: 'Tanggal Lahir Pasien',
            value: form['date_of_birth'] ? formatter.format(new Date(form['date_of_birth'])) : null,
        },
        {
            title: 'Tanggal Pembuatan Formula Cairan',
            value: form['date_formula'] ? formatter.format(new Date(form['date_formula'])) : null,
        },
        {
            title: 'Usia Aktual Pasien (Hari)',
            value: form['actual_age'],
        },
        {
            title: 'Usia gestasi (Minggu)',
            value: form['gestational_age'],
        },
        {
            title: 'Berat Aktual Pasien (Kg)',
            value: form['actual_weight'],
        },
        {
            title: 'Tanggal masuk Perawatan',
            value: form['date_of_treatment'] ? formatter.format(new Date(form['date_of_treatment'])) : null,
        },
        {
            title: 'Perawatan hari ke-',
            value: form['day_care']
        }
    ]

    const totalTransfusion = computed(() => {
        let total = 0

        form['prc_transfusion_amount_transfusion'].forEach((value: any, index:number) => {
            if (value != undefined ) {
                total = total + parseFloat(value)
            }
        })

        form['other_transfusion_amount_transfusion'].forEach((amount: any, index: number) => {
            if (amount != undefined ) {
                total = total + parseFloat(amount)
            }
        })

        return total.toFixed(2)
    })

    const totalNeedTransfusion = computed(() => {
        let total = 0

        form['prc_transfusion_ratio'].forEach((value:any) => {
            if (value != undefined ) {
                total = total + parseFloat(value)
            }
        })

        form['other_transfusion_need'].forEach((value:any) => {
            if (value != undefined ) {
                total = total + parseFloat(value)
            }

        })

        return total.toFixed(2)
    })

    const getPGwarn = (index: number) => {
        if(index == 0){
            return form['warning_nutrition_note'][1]
        }else if(index == 1){
            return form['formula_warning_note'][0]
        }else if(index == 2){
            return form['formula_warning_note'][1];
        }else if(index == 7){
            return 'Hati-hati pada pasien perdarahan'
        }

        return ''
    }

    const getDextroseWarn = computed(() => {
        let dextrose = parseFloat(form['dextrose'][5]);
        if (dextrose > 0 && dextrose <= 12.5) {
            return "Dekstrositas < 12,5% sehingga aman jika diberikan melalui infus periferal";
        } else if (dextrose > 12.5) {
            return "Dekstrositas > 12,5% disarankan untuk menggunakan akses sentral";
        } else {
            return "";
        }

    })

    const getOsmolarity = computed(() => {
        let osmolarity = parseFloat(form['dextrose'][6])
        if (osmolarity > 0 && osmolarity <= 900) {
            return "Osmolaritas terhitung rendah, sehingga aman jika diberikan melalui infus periferal";
        } else if (osmolarity > 900) {
            return "Osmolaritas terhitung tinggi, disarankan untuk menggunakan akses sentral";
        } else {
            return "";
        }
    })

    const getTotalCalories = computed(() => {
        let value = 0

        value = parseFloat((form['parental_need'][0] * 9).toFixed(2))
             + parseFloat((4 * form['non_dextrose_need'][0]).toFixed(2))
             + parseFloat(((( form['nutrition_calories'][0] / 100) * form['nutrition_total'][0]) / form['actual_weight']).toFixed(2))
             + parseFloat(((( form['nutrition_calories'][1] / 100) * form['nutrition_total'][1]) / form['actual_weight']).toFixed(2))
             + parseFloat((5.76 * form['dextrose'][1]).toFixed(2))

        return value.toFixed(2)
    })
</script>

<template>
    <div class="p-5">
        <table>
            <thead>
                <tr v-for="(header, index) in headPersonalData" :key="index">
                    <th class="p-2 pr-5 text-left">
                        {{ header.title }}
                    </th>
                    <td class="py-2">:</td>
                    <td class="p-2">
                        {{ header.value }}
                    </td>
                </tr>
            </thead>
        </table>
        <table class="w-full mt-10 border border-gray-300 table-auto">
            <thead>
                <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-4 py-2 text-left w-[20%]">Total Cairan </th>
                    <th class="px-4 py-2 border border-gray-300">ml/Kg </th>
                    <th class="px-4 py-2 border border-gray-300">VOLUME (mL) </th>
                    <th class="px-4 py-2 border border-gray-300 w-[40%]">PERINGATAN </th>
                </tr>
                <tr>
                    <th class="px-4 py-2 border border-gray-300">
                        TOTAL KEBUTUHAN CAIRAN
                    </th>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{form['fluid_volume_per_day']}}
                    </td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{form['total_fluid_volume']}}
                    </td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{form['formula_warning_total_volume_note']}}
                    </td>
                </tr>
            </thead>
        </table>
        <table class="w-full mt-10 border border-gray-300 table-auto">
            <thead>
                <tr class="bg-gray-100">
                    <th class="w-1/4 px-4 py-2 border border-gray-300">OBAT OBATAN</th>
                    <th class="w-1/4 px-4 py-2 border border-gray-300">ml/Kg </th>
                    <th class="w-1/4 px-4 py-2 border border-gray-300">VOLUME (mL) </th>
                    <th class="w-1/4 px-4 py-2 border border-gray-300"> </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th class="px-4 py-2 text-left border border-gray-300">
                        TOTAL OBAT IV KONTINYU
                    </th>
                    <th class="px-4 py-2 text-center border border-gray-300">
                        {{(form['total_fluid_continue'] / form['actual_weight']).toFixed(2)}}
                    </th>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{form['total_fluid_continue']}}
                    </td>
                </tr>
                <tr>
                    <th class="px-4 py-2 text-left border border-gray-300">
                        Rincian Obat Kontinyu
                    </th>
                    <th class="px-4 py-2 border border-gray-300">
                        VOLUME (mL)
                    </th>
                    <th class="px-4 py-2 border border-gray-300">
                       Rate (mL/jam)
                    </th>
                </tr>
                <tr v-for="(item, index) in form['setup_continue_name']" :key:="index">
                    <td class="px-4 py-2 border border-gray-300">
                        {{item}}
                    </td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{form['setup_continue_total_fluid'][index]}}
                    </td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{form['setup_continue_rate'][index]}}
                    </td>
                </tr>
                <tr>
                    <th class="px-4 py-2 text-left border border-gray-300">
                        TOTAL OBAT IV INTERMITEN
                    </th>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{safeDivide(form['total_fluid_intermitten'], form['actual_weight']).toFixed(2)}}
                    </td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{form['total_fluid_intermitten']}}
                    </td>
                </tr>
                <tr>
                    <th class="px-4 py-2 text-left border border-gray-300">
                        Rincian Obat Intermiten
                    </th>
                    <th class="px-4 py-2 border border-gray-300">
                        Volume (mL) per Kali
                    </th>
                    <th class="px-4 py-2 border border-gray-300">
                        Frekuensi
                    </th>
                    <th class="px-4 py-2 border border-gray-300">
                        Volume/Hari (mL)
                    </th>
                </tr>

                <tr v-for="(item, index) in form['setup_intermitten_name']" :key:="index">
                    <td class="px-4 py-2 border border-gray-300">
                        {{item}}
                    </td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{form['setup_intermitten_need'][index]}}
                    </td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{form['setup_intermitten_frequency'][index]}}
                    </td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{form['setup_intermitten_total_fluid'][index]}}
                    </td>
                </tr>
            </tbody>

        </table>
        <table class="w-full mt-10 border border-gray-300 table-auto">
            <thead>
                <tr class="bg-gray-100">
                    <th class="w-[20%] px-4 py-2 border border-gray-300">KOREKSI ELEKTROLIT MANDIRI</th>
                    <th class="px-4 py-2 border border-gray-300">Dosis</th>
                    <th class="px-4 py-2 border border-gray-300">VOLUME (mL) </th>
                    <th class="px-4 py-2 border border-gray-300">Rate (mL/jam) </th>
                    <th class="w-[30%] px-4 py-2 border border-gray-300">PERINGATAN </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, im) in ['NaCl 3%', 'KCl']">
                    <td class="px-4 py-2 text-center border border-gray-300">{{ item }}</td>
                    <td class="px-4 py-2 text-center border border-gray-300"></td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{ form['correction_continue_total_volume'][im] }}
                    </td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{ form['correction_continue_correction_rate'][im] }}
                    </td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{ form['formula_warning_note'][im] }}
                    </td>
                </tr>
                <tr>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        Calcium gluconate
                    </td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                    </td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{form['correction_intermitten_daily_total'][0]}}
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="w-full mt-10 border border-gray-300 table-auto">
            <thead>
                <tr class="bg-gray-100">
                    <th class="w-[20%] px-4 py-2 border border-gray-300">TRANSFUSI</th>
                    <th class="px-4 py-2 border border-gray-300">VOLUME (mL)</th>
                    <th class="px-4 py-2 border border-gray-300">mL/kg</th>
                    <th class="px-4 py-2 border border-gray-300">Durasi Transfusi (Jam)</th>
                    <th class="w-[30%] px-4 py-2 border border-gray-300">Rate (mL/jam) </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="px-4 py-2 text-left border border-gray-300">Transfusi PRC</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ form['prc_transfusion_amount_transfusion'][0] }}</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ form['prc_transfusion_ratio'][0].toFixed(2) }}</td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{ form['prc_transfusion_duration'][0] }}
                    </td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{ form['prc_transfusion_rate'][0] }}
                    </td>
                </tr>
                <tr>
                    <th colspan="5" class="px-4 py-2 text-left border border-gray-300">
                        Total Transfusi Lain
                    </th>
                </tr>
                <tr v-for="(transfusion, t) in form['other_transfusion_name']" :key="t">
                    <td class="px-4 py-2 text-left border border-gray-300">{{ transfusion }}</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ form['other_transfusion_amount_transfusion'][t] }}</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ form['other_transfusion_need'][t] }}</td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{ form['other_transfusion_duration'][t] }}
                    </td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{ form['other_transfusion_rate'][t] }}
                    </td>
                </tr>
                <tr>
                    <th class="px-4 py-2 text-left border border-gray-300">
                        Total Transfusi
                    </th>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{ totalTransfusion }}
                    </td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{ totalNeedTransfusion }}
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="w-full mt-10 border border-gray-300 table-auto">
            <thead>
                <tr class="bg-gray-100">
                    <th class="w-[20%] px-4 py-2 border border-gray-300">NUTRISI ORAL</th>
                    <th class="px-4 py-2 border border-gray-300">Volume Minum Total/Hari</th>
                    <th class="px-4 py-2 border border-gray-300">mL/kg</th>
                    <th class="px-4 py-2 border border-gray-300">Volume per Kali Minum (mL)</th>
                    <th class="w-[30%] px-4 py-2 border border-gray-300">Interval Minum (Jam)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(nutrition, ni) in form['nutrition_name']">
                    <td class="px-4 py-2 text-left border border-gray-300">{{ nutrition }}</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ form['nutrition_total'][ni] }}</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ form['nutrition_need'][ni] }}</td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{ form['nutrition_volume'][ni] }}
                    </td>
                    <td class="px-4 py-2 text-center border border-gray-300">
                        {{ form['nutrition_interval'][ni] }}
                    </td>
                </tr>

            </tbody>
        </table>
        <div class="mt-10 text-2xl">TOTAL PARENTERAL NUTRITION</div>
        <div class="text-xl">Parental</div>
        <table class="w-full mt-4 border border-gray-300 table-auto">

            <tbody>
                <tr class="bg-gray-100">
                    <th class="w-[20%] px-4 py-2 border border-gray-300 text-left">1. Lipid</th>
                    <th class="px-4 py-2 border border-gray-300">Kebutuhan yang Diresepkan</th>
                    <th class="px-4 py-2 border border-gray-300">Volume (mL)</th>
                    <th class="px-4 py-2 border border-gray-300">PERINGATAN</th>
                </tr>
                <tr v-for="(lipid, li) in ['SMOFLipid 20% (gr/kg)', 'Vitalipid (mL/kg)']">
                    <td class="px-4 py-2 text-left border border-gray-300">{{ lipid }}</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ form['parental_need'][li] }}</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ form['parental_daily'][li] }}</td>
                    <td rowspan="4" v-if="li == 0" class="px-4 py-2 text-center border border-gray-300">
                        {{ form['warning_nutrition_note'][0] }}
                    </td>
                </tr>
                <tr>
                    <th colspan="2" class="px-4 py-2 text-center border border-gray-300">
                        Total Lipid
                    </th>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ form['parental_total'] }}</td>
                </tr>
                <tr>
                    <th colspan="2" class="px-4 py-2 text-center border border-gray-300">
                        Rate Lipid
                    </th>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ form['parental_rate_continue'] }}</td>
                </tr>

                <tr class="bg-gray-100">
                    <th class="w-[20%] px-4 py-2 border border-gray-300 text-left">1. PG</th>
                    <th class="px-4 py-2 border border-gray-300">Kebutuhan yang Diresepkan</th>
                    <th class="px-4 py-2 border border-gray-300">Volume (mL)</th>
                    <th class="px-4 py-2 border border-gray-300">PERINGATAN</th>
                </tr>
                <tr v-for="(pgItem, index) in ['Aminosteril 10% (gr/kg)', 'Na - NaCl 3% (mEq/kg)', 'K - KCl (mEq/kg)', 'Ca - Ca Gluconas (mEq/kg)', 'PO4 - Na3PO4 (mEq/kg)', 'Mg - MgSO4 20% (mEq/kg)', 'Soluvit (1 mL/kg)', 'Heparin (IU)']">
                    <td class="px-4 py-2 text-left border border-gray-300">{{ pgItem }}</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ [5,7].includes(index) ? '' : form['non_dextrose_need'][index] }}</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{  form['non_dextrose_total'][index] }}</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{  getPGwarn(index) }}</td>
                </tr>

                <tr>
                    <td class="px-4 py-2 text-left border border-gray-300" colspan="2">D40%</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ form['dextrose'][2] }}</td>
                    <td rowspan="3" class="px-4 py-2 text-center border border-gray-300">
                        {{ form['warning_nutrition_note'][2] }}
                    </td>
                </tr>
                <tr>
                    <td class="px-4 py-2 text-left border border-gray-300" colspan="2">D10%</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ form['dextrose'][3] }}</td>
                </tr>
                <tr>
                    <td class="px-4 py-2 text-left border border-gray-300" colspan="2">GIR</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ form['dextrose'][1] }}</td>
                </tr>
                <tr>
                    <td class="px-4 py-2 text-left border border-gray-300" colspan="2">Dekstrositas</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ form['dextrose'][5] }}</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ getDextroseWarn }}</td>

                </tr>
                <tr>
                    <td class="px-4 py-2 text-left border border-gray-300" colspan="2">Osmolaritas</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ form['dextrose'][6] }}</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ getOsmolarity }}</td>
                </tr>
                <tr>
                    <th class="px-4 py-2 border border-gray-300" colspan="2">Total Volume PG	</th>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ form['pg_volume'][0] }}</td>
                </tr>
                <tr>
                    <th class="px-4 py-2 border border-gray-300" colspan="2">Rate PG	</th>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ form['pg_rate_continue']}}</td>
                </tr>
            </tbody>
        </table>

        <div class="mt-10 text-2xl">PENGHITUNGAN KALORI</div>
        <table class="w-full mt-4 border border-gray-300 table-auto">
            <thead>
                <tr class="bg-gray-100">
                    <th class="w-[20%] px-4 py-2 border border-gray-300">KOMPONEN</th>
                    <th class="px-4 py-2 border border-gray-300">KALORI (per Gram atau mL)</th>
                    <th class="px-4 py-2 border border-gray-300">KCAL/HARI</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="px-4 py-2 text-left border border-gray-300">LIPID</td>
                    <td class="px-4 py-2 text-center border border-gray-300">9</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ (form['parental_need'][0] * 9).toFixed(2) }}</td>
                </tr>
                <tr>
                    <td class="px-4 py-2 text-left border border-gray-300">PROTEIN</td>
                    <td class="px-4 py-2 text-center border border-gray-300">4</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ (4 * form['non_dextrose_need'][0]).toFixed(2) }}</td>
                </tr>
                <tr>
                    <td class="px-4 py-2 text-left border border-gray-300">KARBOHIDRAT (ORAL 1)</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ ( form['nutrition_calories'][0] / 100).toFixed(2) }}</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ ((( form['nutrition_calories'][0] / 100) * form['nutrition_total'][0]) / form['actual_weight']).toFixed(2) }}</td>
                </tr>
                <tr>
                    <td class="px-4 py-2 text-left border border-gray-300">KARBOHIDRAT (ORAL 2)</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ ( form['nutrition_calories'][1] / 100).toFixed(2) }}</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ ((( form['nutrition_calories'][1] / 100) * form['nutrition_total'][1]) / form['actual_weight']).toFixed(2) }}</td>
                </tr>
                <tr>
                    <td class="px-4 py-2 text-left border border-gray-300">KARBOHIDRAT PARENTERAL</td>
                    <td class="px-4 py-2 text-center border border-gray-300">5.76</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ (5.76 * form['dextrose'][1]).toFixed(2) }}</td>
                </tr>
                <tr>
                    <th class="px-4 py-2 border border-gray-300">TOTAL (KCAL/KG/HARI)</th>
                    <td class="px-4 py-2 text-center border border-gray-300">5.76</td>
                    <td class="px-4 py-2 text-center border border-gray-300">{{ getTotalCalories}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
