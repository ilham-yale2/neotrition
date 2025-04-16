<script setup lang="ts">
    import { computed, ref } from 'vue';
    import {onMounted} from 'vue';
    import Button from '@/components/ui/button/Button.vue';
    import InputGroup from '@/components/InputGroup.vue';
    import Dialog from '@/components/ui/dialog/Dialog.vue';
    import DialogContent from '@/components/ui/dialog/DialogContent.vue';
    import DialogHeader from '@/components/ui/dialog/DialogHeader.vue';
    import DialogTitle from '@/components/ui/dialog/DialogTitle.vue';
    import DialogFooter from '@/components/ui/dialog/DialogFooter.vue';
    import { FolderMinus, Syringe } from 'lucide-vue-next';
    import DialogDescription from '@/components/ui/dialog/DialogDescription.vue';
    import {checkValueNumber, safeDivide} from '@/lib/utils';
    import { calculateEstimateElectrolyte, evaluasiGIR, evaluasiLipid, evaluasiProtein, evaluateNatrium, getCairanNote, kaliumWarning, osmolarity } from './formula';

    const props = defineProps({
        form: {
            type: Object,
            required: true
        },
    })

    const form = props.form

    interface fieldInterface {
        label: string;
        required?: boolean;
        name: string;
        type: string;
        placeholder?: string;
        disabled?: boolean;
        size?: string;
        defaultValue?: any
        options?:any;
        handleChange?: (event: Event) => void;
    }

    const total_fluid_volume = computed(() => {
        const value = form.fluid_volume_per_day * form.actual_weight
        form.total_fluid_volume = value.toFixed(2)
    })

    const patientFields: fieldInterface[] = [
        {
            label: 'Nama Pasien ',
            required: true,
            name: 'patient_name',
            type: 'text',
            placeholder: 'Masukkan Nama Pasien',
            size: 'md:col-span-6',
            disabled: true,
        },
        {
            label: 'Usia Aktual Pasien (Hari)',
            required: true,
            name: 'actual_age',
            type: 'number',
            size: 'md:col-span-2',
            disabled:true
        },
        {
            label: 'Usia Gestasi (Minggu)',
            required: true,
            name: 'gestational_age',
            type: 'number',
            size: 'md:col-span-2',
            disabled:true
        },
        {
            label: 'Berat Aktual (KG)',
            required: true,
            disabled: true,
            name: 'actual_weight',
            type: 'number',
            size: 'md:col-span-2',
        },
    ]

    const totalCairanFields: fieldInterface[] = [
        {
            label: 'Total Volume Cairan Perhari (ml/kg)',
            required: true,
            name: 'fluid_volume_per_day',
            type: 'number',
            size: 'md:col-span-3',
            placeholder: '0.00',
            defaultValue: 0
        },
        {
            label: 'Total Volume Cairan (ml/hari)',
            required: true,
            name: 'total_fluid_volume',
            type: 'number',
            size: 'md:col-span-3',
            placeholder: '0.00',
            defaultValue: total_fluid_volume,
            disabled: true
        }
    ]
    const countTransfusion = ref(0)

    const addOtherTransfusion = () => {
        countTransfusion.value++
        form.other_transfusion_count = countTransfusion.value + 1
    }

    interface nonDextrose {
        label: string;
        info?: string;
        withoutNeedField?: boolean;
    }

    const nonDextroseFields: nonDextrose[] = [
        {
            label: 'Aminosteril 10% (mL)'
        },
        {
            label: 'Na - NaCl 3% (0,513 mEq/mL) (mL)',
            info: `Kadar Na di dalam sediaan NaCl:
                    - 1/2 NS = 0,077 mmol/mL
                    - NS = 0,154 mmol/mL
                    - NaCl 3% = 0,513 mmol/mL`
        },
        {
            label: 'K - KCl 25 mEq/25 mL (mL)'
        },
        {
            label: 'Ca - Ca Gluconate 10% (mL)',
        },
        {
            label: 'PO4 - Sodium Glycophos (mL)',
        },
        {
            label: 'Mg - MgSO4 20% (mL)',
            withoutNeedField: true
        },
        {
            label: 'Soluvit (mL)'
        },
        {
            label: 'Heparin (IU)',
            withoutNeedField: true
        }
    ];

    const continueFields: fieldInterface[] = [
        {
            label: 'Obat IV Kontinyu',
            required: false,
            name: 'setup_continue_name',
            type: 'text',
        },
        {
            label: 'Rate Obat (mL/jam)',
            required: false,
            name: 'setup_continue_rate',
            type: 'number',
        },
        {
            label: 'Durasi Pemberian (Jam)',
            required: false,
            name: 'setup_continue_duration',
            type: 'number',
        },
        {
            label: 'Total (mL/hari)',
            required: false,
            name: 'setup_continue_total_fluid',
            type: 'number',
            disabled: true
        }
    ]

    const intermitenFields: fieldInterface[] = [
        {
            label: 'Obat',
            required: false,
            name: 'setup_intermitten_name',
            type: 'text',
        },
        {
            label: 'Kebutuhan (mL/jam)',
            required: false,
            name: 'setup_intermitten_need',
            type: 'number',
        },
        {
            label: 'Frekuensi (kali/hari)',
            required: false,
            name: 'setup_intermitten_frequency',
            type: 'number',
        },
        {
            label: 'Total (mL/hari)',
            required: false,
            name: 'setup_intermitten_total_fluid',
            type: 'number',
            disabled: true
        }
    ]

    const setupContinueModal = ref(false)
    const countContinue = ref(1)

    const setupIntermittenModal = ref(false)
    const countIntermitten = ref(1)

    const addContinue = () => {
        countContinue.value++
        form['setup_continue_count'] = countContinue.value
    }

    const addIntermitten = () => {
        countIntermitten.value++
        form['setup_intermitten_count'] = countIntermitten.value
    }

    const getTotalContinue = (index: number) => {

        const total = form['setup_continue_rate'][index] * form['setup_continue_duration'][index];
        form['setup_continue_total_fluid'][index] = total;
        return total;
    };

    const getTotalIntermitten = (index: number) => {

        const total = form['setup_intermitten_need'][index] * form['setup_intermitten_frequency'][index];
        form['setup_intermitten_total_fluid'][index] = total;
        return total;
    };

    const getTotalFluidContinue = computed(() => {

        let total = 0;
        form['setup_continue_total_fluid'].forEach((totalFluid: number) => {
            total += totalFluid

        });

        form.total_fluid_continue = total

        return total
    })

    const getTotalFluidIntermitten = computed(() => {

        let total = 0;
        form['setup_intermitten_total_fluid'].forEach((totalFluid: number) => {
            total += totalFluid

        });

        form.total_fluid_intermitten = total

        return total
    })

    const removeContinue = (index: number) => {
        form['setup_continue_name'].splice(index, 1)
        form['setup_continue_rate'].splice(index, 1)
        form['setup_continue_duration'].splice(index, 1)
        form['setup_continue_total_fluid'].splice(index, 1)
        countContinue.value--
    }
    const removeIntermitten = (index: number) => {
        form['setup_intermitten_name'].splice(index, 1)
        form['setup_intermitten_need'].splice(index, 1)
        form['setup_intermitten_frequency'].splice(index, 1)
        form['setup_intermitten_total_fluid'].splice(index, 1)
        countIntermitten.value--
    }

    const defaultValueOtherTransfusion = (inputCorrection: string, index: number) => {
        let value = 0
        if (inputCorrection === 'amount_transfusion' && form['other_transfusion_need'] != null) {
            value = checkValueNumber(form['other_transfusion_need'][index]) * checkValueNumber(form['actual_weight'])
            form['other_transfusion_amount_transfusion'][index] = checkValueNumber(value).toFixed(2)
        }else if (inputCorrection == 'rate' && form['other_transfusion_amount_transfusion'] != null) {
            value = checkValueNumber(form['other_transfusion_amount_transfusion'][index]) / checkValueNumber(form['other_transfusion_duration'][index])
            form['other_transfusion_rate'][index] = form['other_transfusion_duration'][index] > 0 ? checkValueNumber(value).toFixed(2) : 0
        }else{
            if(form['other_transfusion_'+inputCorrection] != null){
                form['other_transfusion_'+inputCorrection][index] = [null, ''].includes(form['other_transfusion_'+inputCorrection][index]) ? 0 : form['other_transfusion_'+inputCorrection][index]
                return form['other_transfusion_'+inputCorrection][index]
            }
        }
        return value
    }


    const getTotalOtherTransfusion = computed(() => {
        const amounts = form['other_transfusion_amount_transfusion'] ?? []
        let total = 0;
        amounts.forEach((totalFluid: number) => {
            total = (total + checkValueNumber(totalFluid))
        });

        form['other_transfusion_total'] = total.toFixed(2)
        return total
    })

    const correctionContinue = (index: number, field: string) => {
        let result = 0
        if (index == 0 ) {
            if (field == 'correction_rate' && form['correction_continue_total_volume'] != null && form['correction_continue_duration'] != null) {
                result = safeDivide(parseFloat(form['correction_continue_total_volume'][index]) , parseFloat(form['correction_continue_duration'][index]));

                form['correction_continue_'+field][index] = result.toFixed(2);

                return parseFloat(result.toFixed(2));
            }else if(field == 'total_volume' && form['correction_continue_target'] != null && form['correction_continue_dilution'] != null){
                result = (((0.6 * (parseFloat(form['correction_continue_target'][index]) - parseFloat(form['natrium'])) * parseFloat(form['actual_weight'])) * 1000) / 513) + parseFloat(form['correction_continue_dilution'][index]);

                result = isNaN(result) ? 0 : result
                form['correction_continue_'+field][index] = Math.max(0, parseFloat(result.toFixed(2)));

                return Math.max(0, result);

            }else{
                if(form['correction_continue_'+field] != null){
                    form['correction_continue_'+field][index] = [null, ''].includes(form['correction_continue_'+field][index]) ? 0 : form['correction_continue_'+field][index]
                    return form['correction_continue_'+field][index]
                }
            }

        }else if(index == 1){
            if (field == 'total_volume' && form['correction_continue_target'] != null) {
                result = parseFloat(form['correction_continue_target'][index]) * parseFloat(form['actual_weight']) + parseFloat(form['correction_continue_dilution'][index])
                form['correction_continue_'+field][index] = result.toFixed(2);

                return form['correction_continue_'+field][index];
            }else if(field == 'correction_rate' && form['correction_continue_total_volume'] != null){
                result = safeDivide(form['correction_continue_total_volume'][index], form['correction_continue_duration'][index]);
                form['correction_continue_'+field][index] = result.toFixed(2);

                return form['correction_continue_'+field][index];

            }else{
                if(form['correction_continue_'+field] != null){
                    form['correction_continue_'+field][index] = [null, ''].includes(form['correction_continue_'+field][index]) ? 0 : form['correction_continue_'+field][index]
                    return form['correction_continue_'+field][index]
                }
            }
        }else if (index == 2) {
            if (field == 'total_fluid' && form['correction_continue_total_volume'] != null){
                form['correction_continue_total_volume'].forEach((fluid: any, index: number) => {
                    result = result + parseFloat(fluid);
                })

                form['correction_continue_'+field] = result.toFixed(2)
            }
        }


    }

    const correctionIntermitten = (index: number, field: string) => {
        let result = 0
        if (index == 0 ) {
            if (field == 'daily_total' && form['correction_intermitten_need'] != null) {
                result = parseFloat(form['correction_intermitten_need'][index]) * parseFloat(form['actual_weight']) * parseFloat(form['correction_intermitten_frequence'][index]) + parseFloat(form['correction_intermitten_dilution'][index]);
                form['correction_intermitten_'+field][index] = result.toFixed(2);

                return result.toFixed(2);
            }else{
                if(form['correction_intermitten_'+field] != null){
                    form['correction_intermitten_'+field][index] = [null, ''].includes(form['correction_intermitten_'+field][index]) ? 0 : form['correction_intermitten_'+field][index]
                    return form['correction_intermitten_'+field][index]
                }
            }
        }
    }

    const defaultValuePrcTransfusion = (inputCorrection: string, index: number) => {
        let value = 0
        if (index == 0) {
            if (inputCorrection == 'amount_transfusion' && form['prc_transfusion_hb_target'] != null) {
                const calculate = (form['prc_transfusion_hb_target'][index] - form['hemoglobin']) * form['actual_weight'] * 4
                const batasAtas = form['actual_weight'] * 20;

                value = parseFloat(Math.max(0, Math.min(calculate, batasAtas)).toFixed(2));
                form['prc_transfusion_'+inputCorrection][index] = value
                return value;

            }else if(inputCorrection == 'ratio' && form['prc_transfusion_amount_transfusion'] != null){
                value = safeDivide(form['prc_transfusion_amount_transfusion'][index], form['actual_weight']);
                form['prc_transfusion_'+inputCorrection][index] = parseFloat(value.toFixed(2));
                return parseFloat(value.toFixed(2));

            }else if(inputCorrection == 'rate' && form['prc_transfusion_duration'] != null && form['prc_transfusion_amount_transfusion'] != null){
                value = safeDivide(form['prc_transfusion_amount_transfusion'][index], form['prc_transfusion_duration'][index]);
                form['prc_transfusion_'+inputCorrection][index] = parseFloat(value.toFixed(2));
                return parseFloat(value.toFixed(2));

            }else{
                if(form['prc_transfusion_'+inputCorrection] != null){
                    form['prc_transfusion_'+inputCorrection][index] = [null, ''].includes(form['prc_transfusion_'+inputCorrection][index]) ? 0 : form['prc_transfusion_'+inputCorrection][index]
                    return form['prc_transfusion_'+inputCorrection][index]
                }
            }
        }
    }

    const getParental = (field: string, index:number ) => {
        let value = 0
        if(field == 'daily' && form['parental_name'] != null){
            if(index == 0){
                value = safeDivide((parseFloat(form['parental_need'][index]) * parseFloat(form['actual_weight']) * 100), 20)
                form['parental_'+field][index] = value.toFixed(2);

                return value.toFixed(2);
            }else if(index == 1){
                value = parseFloat(form['parental_need'][index]) * parseFloat(form['actual_weight'])

                form['parental_'+field][index] = value.toFixed(2);

                return value.toFixed(2);
            }
        }else if(field == 'rate_continue' && form['parental_daily'] != null ){
            if (index == 0) {
                form['parental_daily'].forEach((daily: any, index: number) => {
                    value = value + parseFloat(daily);
                })

                form['parental_'+field] = (value / 24).toFixed(2);

                return (value / 24).toFixed(2);
            }
        }else if(field == 'total' && form['parental_daily'] != null){
            if (index == 0) {
                form['parental_daily'].forEach((daily: any, index: number) => {

                    if (!isNaN(daily)) {
                        value = value + parseFloat(daily ?? 0);
                    }
                })

                form['parental_'+field] = value.toFixed(2);

                return value.toFixed(2);
            }
        }else{
            if(form['parental_'+field] != null){
                form['parental_'+field][index] = [null, ''].includes(form['parental_'+field][index]) ? 0 : form['parental_'+field][index]

                return form['parental_'+field][index]
            }
        }

        return value;
    }

    const getPG = (field: string, index: number) => {
        let value = 0;

        if(field == 'volume' && form['pg_volume'] != null){
            if(index == 0){
                const prc_transfusion_amount = form['prc_transfusion_amount_transfusion'].reduce((a: number, b: number) => a + b, 0)
                value = form['total_fluid_volume'] - form['total_fluid_continue'] - form['total_fluid_intermitten'] - prc_transfusion_amount - form['other_transfusion_total'] - form['nutrition_total'][1] - form['parental_total'] - form['correction_continue_total_fluid'] - form['correction_intermitten_daily_total']

            }else{
                let result = 0;
                nonDextroseFields.forEach((field: any, index: number) => {
                    if (index != nonDextroseFields.length - 1) {
                        result = result + parseFloat(form['non_dextrose_total'][index])
                    }
                })
                value = parseFloat((form['pg_'+field][0] - result).toFixed(2))
            }
            form['pg_'+field][index] = checkValueNumber(value).toFixed(2);

        }else if(field == 'total' && form['pg_volume'] != null){
            value = safeDivide(form['pg_volume'][index], form['actual_weight']);
            form['pg_'+field][index] = value.toFixed(2);
        }else if(field == 'rate_continue' && form['pg_volume'] != null){
            value = safeDivide(form['pg_volume'][index], 24);
            form['pg_'+field] = parseFloat(value.toFixed(2));
        }

        return value.toFixed(2);


    }



    const getNutrition = (field: string, index: number) => {
        let value = 0;
        if (field == 'volume' && form['nutrition_interval'] != null) {
            value = safeDivide(parseFloat(form['nutrition_interval'][index]), safeDivide( 24 ,parseFloat(form['nutrition_total'][index])))
            form['nutrition_'+field][index] = value.toFixed(2);

        }else if(field == 'total' && form['nutrition_need'] != null){
            if (index == 0) {
                value = form['nutrition_need'][index] * form['gestational_age']
            }else if(index == 1){
                value = form['nutrition_need'][index] * form['actual_weight']
            }
            form['nutrition_'+field][index] = value.toFixed(2);
            return value.toFixed(2);
        }else{
            if(form['nutrition_'+field] != null){
                form['nutrition_'+field][index] = [null, ''].includes(form['nutrition_'+field][index]) ? 0 : form['nutrition_'+field][index]
                return form['nutrition_'+field][index]
            }
        }

        return value;
    }

    const getNonDextrose = (index: number) => {
        let value = 0;
        if(form['non_dextrose_name'] != null){
            if (index == 0) {
                const total = parseFloat(form['non_dextrose_need'][index]) * parseFloat(form['actual_weight']) * 100
                value = safeDivide(total, 10);


            }else if(index == 1){
                const weight = form['actual_weight'] * 1000 * parseFloat(form['non_dextrose_need'][index])
                value = safeDivide(weight , 513);


            }else if([2,3,4,6].includes(index)){
                value =  parseFloat(form['non_dextrose_need'][index]) * form['actual_weight']
            }else if(index == 5){
                value = safeDivide(form['actual_weight'] * 40, 200);
            }else{
                value = safeDivide(form['pg_volume'][0], 2);
            }

            form['non_dextrose_total'][index] = value.toFixed(2);

        }
    }

    const getDextrose = (index: number) => {
        if (index > 0 && form['dextrose'] != null) {
            let result = 0;
            if (index == 1) {
                // gir terukur

                result = safeDivide((form['pg_rate_continue'] * form['dextrose'][5]), (6 * form['actual_weight']));

            }else if(index == 2 ){

                // volume D40
                const calculate = form['dextrose'][4] * form['pg_volume'][0]
                const calculate1 = form['pg_volume'][1] * 10
                const hasil = parseFloat(calculate.toFixed(2)) - parseFloat(calculate1.toFixed(2))
                const value = hasil / 30;

                result = Math.max(0, value > form['pg_volume'][1] ? form['pg_volume'][1] : value.toFixed(2));
            }else if (index == 3){
                // volume D10

                result = parseFloat(form['dextrose'][0]) > 0 ?  Math.max(form['pg_volume'][1] - form['dextrose'][2], 0) : 0;

            }else if(index == 4){
                // Dekstrositas (%)
                const calculate = (form['dextrose'][0] * 6 * form['actual_weight']).toFixed(1)
                result = parseFloat(form['dextrose'][0]) > 0 ? Math.min(safeDivide(parseFloat(calculate), form['pg_rate_continue']), 25) : 0;
            }else if(index == 5){
                // Dekstrositas Terkoreksi (%)


                result = safeDivide(((parseFloat(form['dextrose'][2]) * 40) + (parseFloat(form['dextrose'][3]) * 10)), form['pg_volume'][0])
            }else if(index == 6){
                // Osmolaritas (mOsm/L)

                const calculate =
                      safeDivide( (form['non_dextrose_need'][0] * form['actual_weight'] * 1000) , form['pg_volume'][0])
                    + safeDivide( (((0.4 * form['dextrose'][2]) + (0.1 * form['dextrose'][3])) * 1000 * 5) , form['pg_volume'][0])
                    + safeDivide( (0.513 * form['non_dextrose_total'][1] * 1000) , form['pg_volume'][0])
                    + safeDivide( (form['non_dextrose_total'][2] * 1000) , form['pg_volume'][0])
                    + safeDivide( (form['non_dextrose_total'][4] * 2 * 1000) , form['pg_volume'][0])
                    + safeDivide( (form['non_dextrose_total'][4] * 2 * 1000) , form['pg_volume'][0])
                    + safeDivide( (0.93 * form['non_dextrose_total'][3] * 1000) , form['pg_volume'][0])
                    + safeDivide( (8 * form['non_dextrose_total'][5] * 1000) , form['pg_volume'][0])
                    + safeDivide( (form['parental_need'][0] * form['actual_weight'] * 0.7 * 1000) , form['parental_total']);

                result = osmolarity(form['pg_volume'][0], form['parental_total'], form['non_dextrose_need'][0], form['actual_weight'], form['dextrose'][2],form['dextrose'][3], form['non_dextrose_total'][1], form['non_dextrose_total'][2], form['non_dextrose_total'][4], form['non_dextrose_total'][3], form['non_dextrose_total'][5], form['parental_need'][0]  )
            }

            form['dextrose'][index] = result.toFixed(2);
        }

        return 0
    }

    const cairanNote = computed(() => {
        const note = getCairanNote(parseFloat(form['actual_age']), parseFloat(form['gestational_age']), parseFloat(form['fluid_volume_per_day']), parseFloat(form['total_fluid_volume']) )

        form['formula_warning_total_volume_note'] = note

        return note
    })

    const warningBalanceEstimate = (field: string) => {
        let value = 0
        if (field == 'balance_estimate') {
            const calculate = form['output_fluid'] * safeDivide(24, form['time_calculation'])
            value = parseFloat(form['total_fluid_volume']) - (parseFloat(form['insensible_water_loss']) + calculate )
            form['formula_warning_balance_estimate'] = value.toFixed(2);
        }else{
            value = safeDivide(form['formula_warning_balance_estimate'], form['actual_weight'])
            form['formula_warning_balance_volume'] = value.toFixed(2)
        }
    }

    const warningElectrolyte = (field: string, index: number = 0) => {
        let value:any = 0;
        if (field === 'electrolyte_estimate' && form['correction_continue_total_volume'] != null) {
            value = calculateEstimateElectrolyte(form['actual_weight'], form['correction_continue_total_volume'][0],  form['correction_continue_dilution'][0], form['non_dextrose_total'][1], form['non_dextrose_total'][4])
            form['formula_warning_electrolyte_estimate'] = value.toFixed(2);
        } else if(field === 'daily_dose' && form['correction_continue_total_volume'] != null){
            value = safeDivide((form['correction_continue_total_volume'][1] - form['correction_continue_dilution'][1]) + form['non_dextrose_total'][2], form['actual_weight']);

            form['formula_warning_electrolyte_daily_dose'] = value.toFixed(2);
        }else {
            if (index == 0) {

                value = evaluateNatrium(form['natrium'], parseFloat(form['formula_warning_electrolyte_estimate']))
            }else{
                value = kaliumWarning(form['action_weight'], form['formula_warning_electrolyte_daily_dose'], form['kalium']);
            }


            form['formula_warning_note'] != null ? form['formula_warning_note'][index] = value : null

        }

        return value;
    };

    const getNutritionNote = (field: string) => {
        let value = '';
        if (field == 'lipid' && form['parental_need'] != null) {
            value = evaluasiLipid(form['actual_age'], form['parental_need'][0])
            form['warning_nutrition_note'][0] = value;
        }else if(field === 'protein' && form['non_dextrose_need'] != null){
            value = evaluasiProtein(form['actual_age'], form['gestational_age'], form['non_dextrose_need'][0])
            form['warning_nutrition_note'][1] = value;
        }else if(field == 'gir' && form['dextrose'] != null){
            value = evaluasiGIR(form['actual_age'], form['gestational_age'], form['dextrose'][1])
            form['warning_nutrition_note'][2] = value
        }

        return value;

    }

    const getNutritionFormula = (index:number) => {
        let value = 0
        if (form['warning_nutrition_formula'] != null) {
            if (index == 0) {
                value = parseFloat(form['parental_need'][0])
            }else if(index == 1){
                value = parseFloat(form['non_dextrose_need'][0])
            }else{
                value = parseFloat(form['dextrose'][1])
            }
            form['warning_nutrition_formula'][index] = value.toFixed(1)
        }
    }

    const removeOtherTransfusion = (index: number) => {
        if (index > 1) {

            ['name','need', 'amount_transfusion', 'duration', 'rate'].forEach((correction, index) => {
               form['other_transfusion_' + correction] =  form['other_transfusion_' + correction].splice(index, 1);
            })

            countTransfusion.value = countTransfusion.value - 1
        }
    }

    onMounted(() => {
        if (form['other_transfusion_name'] == null) {
            form['other_transfusion_name'] = [];
            ['TC Concentrate/TC biasa', 'FFP'].forEach((correction, index) => {
                form['other_transfusion_name'][index] = correction
            });

        }

        if (form['nutrition_name'] == null) {
            form['nutrition_name'] = [];
            [['ASI'], ''].forEach((value, index) => {

                form['nutrition_name'][index] = typeof value === 'string' ? value : value[0]
            });
        }

        if (form['parental_name'] == null) {
            form['parental_name'] = [];


            form['parental_need'] = form['parental_need'] ?? [0,0];
            form['parental_daily'] = form['parental_daily'] ?? [0,0];
            form['parental_rate_continue'] = form['parental_rate_continue'] ?? 0;

            ['SMOFLipid', 'Vitalipid'].forEach((value, index) => {

                form['parental_name'][index] = value
            });
        }

        ['need', 'amount_transfusion', 'duration', 'rate'].forEach((value, index) => {


            form['other_transfusion_'+value] = form['other_transfusion_'+value] ?? ['', '']

        });

        ['target', 'dilution', 'duration', 'correction_rate', 'total_volume'].forEach((value, index) => {
            form['correction_continue_'+value] = form['correction_continue_'+value] ?? [0, 0]
        })

        continueFields.forEach((field, index) => {
            form[field.name] = form[field.name] ?? ['']
        })

        intermitenFields.forEach((field, index) => {
            form[field.name] = form[field.name] ?? ['']
        })

        countTransfusion.value = form['other_transfusion_count'] ?? 0

        countContinue.value = form['setup_continue_count'] ?? 1

        countIntermitten.value = form['setup_intermitten_count'] ?? 1;

        ['Calcium Gluconate 10%'].forEach((value:any, index: any) => {
            ['need', 'dilution', 'frequence', 'daily_total'].forEach((value2, index2) => {
                form['correction_intermitten_'+value2] = form['correction_intermitten_'+value2] ?? [0]
            })
        });

        ['Transfusi PRC'].forEach((value, index) => {
            ['hb_target', 'amount_transfusion', 'ratio', 'duration'].forEach((value2, index2) => {
                form['prc_transfusion_'+value2] = form['prc_transfusion_'+value2] ?? [0]
            })
        });

        form['prc_transfusion_rate'] = form['prc_transfusion_rate'] ?? [0];

        ['need', 'daily'].forEach((value, index) => {
            form['parental_'+value] = form['parental_'+value] ?? [0, 0]
        });

        ['Volume PG Total', 'Volume Dextrosa Yang Dapat Diberikan di Dalam PG'].forEach((value, index) => {
            form['pg_volume'] = form['pg_volume'] ?? [0, 0]
            form['pg_total'] = form['pg_total'] ?? [0, 0]
        });

        form['total_fluid_continue'] = form['total_fluid_continue'] ?? 0;
        form['total_fluid_intermitten'] = form['total_fluid_intermitten'] ?? 0;

        ['need', 'calories', 'interval', 'volume', 'total'].forEach((value, index) => {
            form['nutrition_'+value] = form['nutrition_'+value] ?? [0, 0]
        });

        // non_dextrose_need
        // non_dextrose_total
        const ndf: any = [];
        nonDextroseFields.forEach((field, index) => {
            ndf.push(field.label)
            form['non_dextrose_need'] = form['non_dextrose_need'] ?? [0, 0, 0, 0, 0 ,0 , 0, 0]
            form['non_dextrose_total'] = form['non_dextrose_total'] ?? [0, 0, 0, 0, 0 ,0 , 0, 0]
        })
        form['non_dextrose_name'] = form['non_dextrose_name'] ?? ndf;

        form['dextrose'] = form['dextrose'] ?? [0,0,0,0,0,0,0]

        form['formula_warning_note'] = form['formula_warning_note'] ?? ['', '']
        form ['warning_nutrition_note'] = form['warning_nutrition_note'] ?? ['', '', '']
        form ['warning_nutrition_formula'] = form['warning_nutrition_formula'] ?? ['', '', '']
    })
</script>
<template>

    <div class="grid w-full grid-cols-12 p-5 rounded-lg gap-7">
        <div :class="field.size" class="col-span-12" v-for="field in patientFields">
            <InputGroup :form="form" :label="field.label" :name="field.name" :type="field.type" :placeholder="field?.placeholder" :required="field.required" :disabled="field?.disabled" :defaultValue="field?.defaultValue"  :options="field?.options" :handleChange="field?.handleChange" />
        </div>
    </div>
    <div class="col-span-12 px-5 mt-6 mb-2 text-lg font-bold"> TOTAL CAIRAN</div>
    <div class="grid w-full grid-cols-12 px-5 rounded-lg gap-7">
        <div :class="field.size" class="col-span-12" v-for="field in totalCairanFields">
            <InputGroup :form="form" :label="field.label" :name="field.name" :type="field.type" :placeholder="field?.placeholder" :required="field.required" :disabled="field?.disabled" :defaultValue="field?.defaultValue"  :options="field?.options" :handleChange="field?.handleChange" />
        </div>
    </div>
    <div class="col-span-12 px-5 mt-10 mb-2 text-lg font-bold"> OBAT INTERVENA KONTINYU - BICNAT, INTROPIK, VASOLPRESSOR, SEDASI</div>
    <div class="grid w-full grid-cols-12 px-5 rounded-lg gap-7">
        <div class="col-span-12 pt-4 md:col-span-3">
            <Button @click="setupContinueModal = true" type="button">Setup Kebutuhan Intervena Kontinyu</Button>
        </div>
        <div class="col-span-12 md:col-span-3">
            <InputGroup :form="form" :label="'Total Cairan Obat Kontinyu'" :name="'total_fluid_continue'" :type="'number'" :disabled="true" />
        </div>
    </div>
    <div class="col-span-12 px-5 mt-6 mb-2 text-lg font-bold"> OBAT INTERVENA INTERMITTEN</div>
    <div class="grid w-full grid-cols-12 px-5 rounded-lg gap-7">
        <div class="col-span-12 pt-4 md:col-span-3">
            <Button @click="setupIntermittenModal = true" type="button">Setup Kebutuhan Intervena Intermitten</Button>
        </div>
        <div class="col-span-12 md:col-span-3">
            <InputGroup :form="form" :label="'Total Cairan Obat Intermitten'" :name="'total_fluid_intermitten'" :type="'number'"  :disabled="true" />
        </div>
    </div>
    <div class="col-span-12 px-5 mt-6 mb-2 text-lg font-bold">KOREKSI ELEKTROLIT KONTINYU</div>
    <div class="p-5">
        <table>
            <thead>
                <tr class="text-left">
                    <th class="px-2 text-[14px]">KOREKSI</th>
                    <th class="px-2 text-[14px]">Target Koreksi/Kebutuhan</th>
                    <th class="px-2 text-[14px]">Pengenceran (NS/Aqua/D10)</th>
                    <th class="px-2 text-[14px]">Durasi Koreksi (Jam)</th>
                    <th class="px-2 text-[14px]">Rate Koreksi (mL/jam)</th>
                    <th class="px-2 text-[14px]" >Total Volume</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(correction, index) in ['Sodium Chloride (NaCl) 3%', 'Potassium Chloride (KCl)']" :key="index">
                    <td class="py-2">
                        {{ correction }}
                    </td>
                    <td class="px-2 py-2" v-for="(inputCorrection, ic) in ['target', 'dilution', 'duration', 'correction_rate', 'total_volume']">
                        <InputGroup :form="form" :name="'correction_continue_'+inputCorrection" :index="index" :type="'number'" :disabled="ic > 2 ? true : false" :defaultValue="correctionContinue(index, inputCorrection)" />
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="5" class="text-left">
                        Total Cairan untuk Koreksi Elektrolit IV Kontinyu
                    </th>
                    <th class="px-2">
                        <InputGroup :form="form" :name="'correction_continue_total_fluid'" :type="'number'" :disabled="true" :defaultValue="correctionContinue(2, 'total_fluid')" />
                    </th>
                </tr>
            </tfoot>
        </table>
    </div>
    <div class="col-span-12 px-5 mt-6 mb-2 text-lg font-bold">KOREKSI ELEKTROLIT INTRAVENA INTERMITTEN</div>
    <div class="p-5">
        <table class="w-full">
            <thead>
                <tr class="text-left">
                    <th class="px-2 text-[14px]">Obat IV dan Oral Intermiten    </th>
                    <th class="px-2 text-[14px]">Kebutuhan (mL/kg)</th>
                    <th class="px-2 text-[14px]">Pengenceran (NS/Aqua/D5W)</th>
                    <th class="px-2 text-[14px]">Frekuensi</th>
                    <th class="px-2 text-[14px]">Total dalam 24 Jam</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(correction, index) in ['Calcium Gluconate 10%']" :key="index">
                    <td class="py-2">
                        {{ correction }}
                    </td>
                    <td class="px-2 py-2" v-for="(inputCorrection, ic) in ['need', 'dilution', 'frequence', 'daily_total']">
                        <InputGroup :form="form" :name="'correction_intermitten_'+inputCorrection" :index="index" :type="'number'" :defaultValue="correctionIntermitten(index, inputCorrection)" :disabled="inputCorrection == 'daily_total' ? true : false" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="col-span-12 px-5 mt-6 mb-2 text-lg font-bold">TRANSFUSI PRC</div>
    <div class="p-5">
        <table class="w-full">
            <thead>
                <tr class="text-left">
                    <th class="px-2 text-[14px]"></th>
                    <th class="px-2 text-[14px]">Target Hb</th>
                    <th class="px-2 text-[14px]">Jumlah Transfusi mL</th>
                    <th class="px-2 text-[14px]">Rasio Terukur</th>
                    <th class="px-2 text-[14px]">Durasi Pemberian (Jam)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(correction, index) in ['Transfusi PRC']" :key="index">
                    <td class="py-2">
                        {{ correction }}
                    </td>
                    <td class="px-2 py-2" v-for="(inputCorrection, ic) in ['hb_target', 'amount_transfusion', 'ratio', 'duration']">
                        <InputGroup :form="form" :name="'prc_transfusion_'+inputCorrection" :index="index" :type="'number'"  :defaultValue="defaultValuePrcTransfusion(inputCorrection, index)" :disabled="['amount_transfusion', 'ratio'].includes(inputCorrection) ? true : false"/>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="4" class="px-2 text-right">
                        Rate Transfusi <br>
                        (mL/Jam)
                    </th>
                    <th class="px-2">
                        <InputGroup :form="form" :name="'prc_transfusion_rate'" :index="0" :type="'number'" :disabled="true" :defaultValue="defaultValuePrcTransfusion('rate', 0)"/>
                    </th>
                </tr>
            </tfoot>
        </table>
    </div>
    <div class="col-span-12 px-5 mt-6 mb-2 text-lg font-bold">TRANSFUSI LAIN</div>
    <div class="p-5">
        <table class="w-full">
            <thead>
                <tr class="text-left">
                    <th class="px-2 text-[14px]"></th>
                    <th class="px-2 text-[14px]">Kebutuhan (mL/kg)</th>
                    <th class="px-2 text-[14px]">Jumlah Transfusi </th>
                    <th class="px-2 text-[14px]">Durasi Pemberian (Jam)</th>
                    <th class="px-2 text-[14px]">Rate Transfusi (mL/Jam)</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(correction, index) in ['TC Concentrate/TC biasa', 'FFP']" :key="index">
                    <td class="py-2">
                        {{ correction }}
                    </td>
                    <td class="px-2 py-2" v-for="(inputCorrection, ic) in ['need', 'amount_transfusion', 'duration', 'rate']">
                        <InputGroup :form="form" :name="'other_transfusion_'+inputCorrection" :index="index" :defaultValue="defaultValueOtherTransfusion(inputCorrection, index)" :type="'number'" :disabled="[1,3].includes(ic) ? true : false" placeholder="0"/>
                    </td>
                </tr>
                <tr v-for="(i, idx) in countTransfusion" :key="i">
                    <td class="p-2">
                        <InputGroup :form="form" :name="'other_transfusion_name'" :index="idx + 2" :type="'text'" placeholder="Input Transfusi" />
                    </td>
                    <td class="px-2 py-2" v-for="(inputCorrection, ic) in ['need', 'amount_transfusion', 'duration', 'rate']">
                        <InputGroup :form="form" :name="'other_transfusion_'+inputCorrection" :index="idx + 2" :defaultValue="defaultValueOtherTransfusion(inputCorrection, idx+2)" :type="'number'" :disabled="[1,3].includes(ic) ? true : false"/>
                    </td>
                    <td class="px-2 py-2">
                        <Button type="button" variant="destructive" @click="removeOtherTransfusion(idx + 2)">Delete</Button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th>
                        <Button type="button" @click="addOtherTransfusion">
                            <Syringe/>
                            <span>Tambahkan Transfusi Lain</span>
                        </Button>
                    </th>
                </tr>
                <tr>
                    <th colspan="2" class="px-2 text-right">
                        Total Transfusi Lain <br>
                    </th>
                    <th class="px-2">
                        <InputGroup :form="form" :name="'other_transfusion_total'" :defaultValue="getTotalOtherTransfusion" :type="'number'" :disabled="true" />
                    </th>
                </tr>
            </tfoot>
        </table>
    </div>
    <div class="col-span-12 px-5 mt-6 mb-2 text-lg font-bold">NUTRISI</div>
    <div class="p-5">
        <table class="w-full">
            <thead>
                <tr class="text-left">
                    <th class="px-2 text-[14px]">ORAL/ENETRAL</th>
                    <th class="px-2 text-[14px]">Kebutuhan (mL/kg)</th>
                    <th class="px-2 text-[14px]">Kalori dari Nutrisi Oral Per 100 mL (kcal/ 100 mL) </th>
                    <th class="px-2 text-[14px]">Interval Antar Minum (jam)</th>
                    <th class="px-2 text-[14px]">Volume Per Kali Minum</th>
                    <th class="px-2 text-[14px]">Total Minum/Hari</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(correction, index) in [[{label: 'ASI', value: 'ASI'}, {label: 'ASI 2', value: 'ASI 2'}], '']" :key="index">
                    <td class="py-2">
                        <InputGroup :form="form" :name="'nutrition_name'" :index="index" :type="typeof correction === 'string' ? 'text' : 'select'" placeholder="Input Nutrisi" :defaultValue="typeof correction === 'string' ? correction : correction[0].value" :options="typeof correction === 'string' ? [] : correction"/>
                    </td>
                    <td class="px-2 py-2" v-for="(inputCorrection, ic) in ['need', 'calories', 'interval', 'volume', 'total']">
                        <InputGroup :form="form" :name="'nutrition_'+inputCorrection" :defaultValue="getNutrition(inputCorrection, index)" :index="index" :type="'number'" :disabled="ic > 2 ? true : false" :placeholder="'0'"/>
                    </td>
                </tr>

            </tbody>
        </table>
    </div>
    <div class="col-span-12 px-5 mt-6 text-lg font-bold">PARENTAL</div>
    <div class="col-span-12 px-5 mb-2 text-base font-bold">LIPID (DALAM SPUIT 50 CC TERPISAH TERTUTUP DARI CAHAYA LANGSUNG)</div>
    <div class="p-5">
        <table class="w-full">
            <thead>
                <tr class="text-left">
                <th class="px-2 text-[14px] w-[25%]">Komponen</th>
                <th class="px-2 text-[14px]">Kebutuhan (mL/kg)</th>
                <th class="px-2 text-[14px]">Total (mL/hari)</th>
                <th class="px-2 text-[14px]">Rate Kontinyu (mL/jam)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(correction, ip) in ['SMOFLipid', 'Vitalipid']" :key="ip">
                    <td class="p-2">
                        {{ correction }}
                    </td>

                    <td class="px-2 py-2">
                        <InputGroup :form="form" :name="'parental_need'" :index="ip" type="number" placeholder="0.00" :defaultValue="getParental('need', ip)" :disabled="false"/>
                    </td>
                    <td class="px-2 py-2">
                        <InputGroup :form="form" :name="'parental_daily'" :index="ip" :disabled="true" :defaultValue="getParental('daily', ip)" type="number" />
                    </td>

                    <td class="p-2" style="vertical-align: middle;"  v-if="ip === 0" :rowspan="2">
                        <InputGroup :form="form" name="parental_rate_continue" type="number" :defaultValue="getParental('rate_continue', ip)" :disabled="true" />
                    </td>
                    <td v-else style="display: none"></td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="2" class="px-2 text-[14px] w-[25%] text-left">TOTAL</th>
                    <td class="p-2">
                        <InputGroup :form="form" name="parental_total" type="number" :defaultValue="getParental('total', 0)" :disabled="true" />

                    </td>
                </tr>
            </tfoot>
        </table>
    </div>

    <div class="col-span-12 px-5 mt-6 mb-2 text-lg font-bold">PG (DALAM DISPOSABLE STERILE TPN BAG TERTUTUP DARI CAHAYA LANGSUNG)</div>
    <div class="p-5">
        <table class="w-full">
            <thead>
                <tr class="text-left">
                <th class="px-2 text-[14px] w-[25%]">Komponen</th>
                <th class="px-2 text-[14px]">Volume</th>
                <th class="px-2 text-[14px]">mL/kg</th>
                <th class="px-2 text-[14px]">Rate Kontinyu (mL/jam)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(correction, ip) in ['Volume PG Total', 'Volume Dextrosa Yang Dapat Diberikan di Dalam PG']" :key="ip">
                    <td class="p-2">
                        {{ correction }}
                    </td>

                    <td class="px-2 py-2">
                        <InputGroup :disabled="true" :form="form" :name="'pg_volume'" :index="ip" type="number" :defaultValue="getPG('volume', ip)" />
                    </td>
                    <td class="px-2 py-2">
                        <InputGroup :disabled="true" :form="form" :name="'pg_total'" :index="ip" type="number"  :defaultValue="getPG('total', ip)"/>
                    </td>

                    <td v-if="ip === 0" class="" >
                        <InputGroup :disabled="true" :form="form" name="pg_rate_continue" type="number" :defaultValue="getPG('rate_continue', 0)" />
                    </td>
                    <td v-else style="display: none"></td>
                </tr>
            </tbody>

        </table>
    </div>

    <div class="col-span-12 px-5 mt-6 mb-2 text-lg font-bold">KOMPONEN NON-DEXTROSE (TERMASUK DALAM STERILE TPN BAG)</div>
    <div class="p-5">
        <table class="w-full">
            <thead>
                <tr class="text-left">
                    <th class="px-2 text-[14px] w-[25%]">Komponen</th>
                    <th class="px-2 text-[14px]">Kebutuhan</th>
                    <th class="px-2 text-[14px]">Total (mL/hari atau IU/hari)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(correction, ip) in nonDextroseFields" :key="ip">
                    <td class="p-2">
                        {{ correction.label }}
                    </td>

                    <td class="px-2 py-2">
                        <InputGroup :form="form" :name="'non_dextrose_need'" :index="ip" type="number" v-show="correction.withoutNeedField != true"  placeholder="0"/>
                    </td>
                    <td class="px-2 py-2">
                        <InputGroup :form="form" :name="'non_dextrose_total'" :index="ip" type="number" :disabled="true" placeholder="0.00" :defaultValue="getNonDextrose(ip)"/>
                    </td>

                </tr>
            </tbody>

        </table>
    </div>
    <div class="col-span-12 px-5 mt-6 mb-2 text-lg font-bold">KOMPONEN DEXTROSE (TERMASUK DALAM STERILE TPN BAG)</div>
    <div class="p-5">
        <table class="w-full">
            <thead>
                <tr class="text-left">
                    <th class="px-2 text-[14px] ">GIR Target</th>
                    <th class="px-2 text-[14px]">GIR Terukur </th>
                    <th class="px-2 text-[14px]">Volume D40%</th>
                    <th class="px-2 text-[14px]">Volume D10%</th>
                    <th class="px-2 text-[14px]">Dekstrositas (%)</th>
                    <th class="px-2 text-[14px]">Dekstrositas Terkoreksi (%)</th>
                    <th class="px-2 text-[14px]">Osmolaritas (mOsm/L)</th>
                </tr>
            </thead>
            <tbody>
                <tr>

                    <td class="px-2 py-2" v-for="(correction, ip) in ['gir_target', 'gir_terukur', 'volume', 'volume_2', 'dexstrosity', 'dexstrosity_correction', 'osmolarity']" :key="ip">
                        <InputGroup :form="form" :name="'dextrose'" :index="ip" type="number" :defaultValue="getDextrose(ip)" :disabled="ip > 0 ? true : false" placeholder="0"/>
                    </td>

                </tr>
            </tbody>

        </table>
    </div>
    <div class="col-span-12 px-5 mt-6 mb-2 text-lg font-bold">Tanda Peringatan Formula</div>
    <div class="p-5">
        <table class="w-full">
            <tbody>

                <tr>
                    <th class="p-2 text-left"> Total Cairan Harian</th>
                    <th class="p-2 text-left"> Formulasi Terhitung</th>
                    <th class="p-2 text-left w-[35%]" > Peringatan</th>
                </tr>
                <tr>
                    <td class="p-2">
                        Total Volume (mL/kg)
                    </td>
                    <td class="px-2 py-2">
                        <!-- <InputGroup :form="form" :name="'formula_warning_total_volume'" type="number" :disabled="true" placeholder="0"/> -->
                    </td>
                    <td class="p-2">
                        <p>{{ cairanNote }}</p>
                    </td>
                </tr>
                <tr>
                    <th class="p-2 text-left"> Estmasi Balans</th>
                    <th class="p-2 text-left"> Balans Kumulatif/24 Jam (mL/hari)</th>
                    <th class="p-2 text-left w-[35%]" > mL/kg</th>
                </tr>
                <tr>
                    <td class="p-2">
                        Estimasi Balans/24 Jam
                    </td>
                    <td class="px-2 py-2">
                        <InputGroup :form="form" :name="'formula_warning_balance_estimate'" :defaultValue="warningBalanceEstimate('balance_estimate')" type="number" :disabled="true" placeholder="0"/>
                    </td>
                    <td class="px-2 py-2">
                        <InputGroup :form="form" :name="'formula_warning_balance_volume'" :defaultValue="warningBalanceEstimate('balance_volume')" type="number" :disabled="true" placeholder="0"/>
                    </td>
                </tr>
                <tr>
                    <th class="p-2 text-left"> Elektrolit</th>
                    <th class="p-2 text-left"> Estimasi Perubahan Kadar Serum (mEq/L/hari)</th>
                    <th class="p-2 text-left w-[35%]" > Peringatan</th>
                </tr>
                <tr>
                    <td class="p-2">
                        Natrium
                    </td>
                    <td class="px-2 py-2">
                        <InputGroup :form="form" :name="'formula_warning_electrolyte_estimate'" :defaultValue="warningElectrolyte('electrolyte_estimate')" type="number" :disabled="true" placeholder="0"/>
                    </td>
                    <td class="px-2 py-2">
                        <p>{{ warningElectrolyte('note') }}</p>
                    </td>
                </tr>
                <tr>
                    <td class="p-2">
                        Kalium
                    </td>
                    <td class="px-2 py-2">
                        <div class="text-[16px] font-bold mb-2">Dosis Harian (mEq/kg)</div>
                        <InputGroup :form="form" :name="'formula_warning_electrolyte_daily_dose'" :defaultValue="warningElectrolyte('daily_dose')" type="number" :disabled="true" placeholder="0"/>
                    </td>
                    <td class="px-2 py-2">
                        <p> {{ warningElectrolyte('note', 1) }} </p>
                    </td>
                </tr>
                <tr>
                    <th class="p-2 text-left"> Nutrisi</th>
                    <th class="p-2 text-left"> Formulasi Terhitung</th>
                    <th class="p-2 text-left w-[35%]" > Peringatan</th>
                </tr>
                <tr>
                    <td class="p-2">
                        Lipid (gr/kg)
                    </td>
                    <td class="px-2 py-2">
                        <InputGroup :form="form" :name="'warning_nutrition_formula'" :index="0" :defaultValue="getNutritionFormula(0)" type="number" :disabled="true" placeholder="0"/>
                    </td>
                    <td class="px-2 py-2">
                        <p>{{ getNutritionNote('lipid') }}</p>
                    </td>
                </tr>
                <tr>
                    <td class="p-2">
                        Protein (gr/kg)
                    </td>
                    <td class="px-2 py-2">
                        <InputGroup :form="form" :name="'warning_nutrition_formula'" :index="1" :defaultValue="getNutritionFormula(1)" type="number" :disabled="true" placeholder="0"/>
                    </td>
                    <td class="px-2 py-2">
                        <p>{{ getNutritionNote('protein') }}</p>
                    </td>
                </tr>
                <tr>
                    <td class="p-2">
                        GIR (mg/kg/min)
                    </td>
                    <td class="px-2 py-2">
                        <InputGroup :form="form" :name="'warning_nutrition_formula'" :index="2" :defaultValue="getNutritionFormula(2)" type="number" :disabled="true" placeholder="0"/>
                    </td>
                    <td class="px-2 py-2">
                        <p>{{ getNutritionNote('gir') }}</p>
                    </td>
                </tr>
            </tbody>

        </table>
    </div>

    <Dialog :open="setupContinueModal" @close="setupContinueModal = false">
        <DialogContent class="sm:max-w-[98%] md:max-w-[800px] p-0 max-h-[90dvh]" :button-close="false">
            <DialogHeader class="p-6 pb-0">
                <DialogTitle>OBAT INTERVENA KONTINYU</DialogTitle>
                <DialogDescription>OBAT INTERVENA KONTINYU - BICNAT, INTROPIK, VASOLPRESSOR, SEDASI</DialogDescription>
            </DialogHeader>
            <div class="px-6 overflow-y-auto max-h-[450px]">
                <table class="w-full ">
                    <thead>
                        <tr>
                            <td v-for="field in continueFields" class="p-2 text-sm">
                                {{ field.label }}
                            </td>
                            <td>

                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(c, index) in countContinue">
                            <td class="p-2" v-for="(field, fi) in continueFields">
                                <InputGroup :min="0" :form="form" :name="field.name" :index="index" :type="field.type" :placeholder="field?.placeholder" :required="field.required" :disabled="field?.disabled" :defaultValue="fi == continueFields.length - 1 ? getTotalContinue(index) : ''"  :options="field?.options"/>
                            </td>
                            <td class="p-2" v-if="index > 0">
                                <Button type="button" @click="removeContinue(index)" variant="destructive">Hapus</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Button type="button"  @click="addContinue">
                                    Tambah Obat IV Kontinyu
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2"></td>
                            <td class="p-2" colspan="2">
                                <InputGroup :min="0" label="Total Cairan untuk Obat IV Kontinyu" :form="form" :name="'total_fluid_continue'" :type="'number'"  :disabled="true" :defaultValue="getTotalFluidContinue"/>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                .
            </div>
            <DialogFooter class="p-6">
                <Button type="button"  @click="setupContinueModal = false;">
                    Simpan
                </Button>

            </DialogFooter>
        </DialogContent>
    </Dialog>
    <Dialog :open="setupIntermittenModal" @close="setupIntermittenModal = false">
        <DialogContent class="sm:max-w-[98%] md:max-w-[800px] p-0 max-h-[90dvh]" :button-close="false">
            <DialogHeader class="p-6 pb-0">
                <DialogTitle>OBAT INTERVENA INTERMITTEN</DialogTitle>
                <DialogDescription>OBAT IV dan Oral Intermiten</DialogDescription>
            </DialogHeader>
            <div class="px-6 overflow-y-auto max-h-[450px]">
                <table class="w-full ">
                    <thead>
                        <tr>
                            <td v-for="field in intermitenFields" class="p-2 text-sm">
                                {{ field.label }}
                            </td>
                            <td>

                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(c, index) in countIntermitten">
                            <td class="p-2" v-for="(field, fi) in intermitenFields">
                                <InputGroup :min="0" :form="form" :name="field.name" :index="index" :type="field.type" :placeholder="field?.placeholder" :required="field.required" :disabled="field?.disabled" :defaultValue="fi == continueFields.length - 1 ? getTotalIntermitten(index) : ''"  :options="field?.options"/>
                            </td>
                            <td class="p-2" v-if="index > 0">
                                <Button type="button" @click="removeIntermitten(index)" variant="destructive">Hapus</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Button type="button"  @click="addIntermitten">
                                    Tambah Obat
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2"></td>
                            <td class="p-2" colspan="2">
                                <InputGroup :min="0" label="Total Cairan untuk Obat IV Intermitten" :form="form" :name="'total_fluid_intermitten'" :type="'number'"  :disabled="true" :defaultValue="getTotalFluidIntermitten"/>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                .
            </div>
            <DialogFooter class="p-6">
                <Button type="button"  @click="setupIntermittenModal = false;">
                    Simpan
                </Button>

            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<style>
    table tr td{
        vertical-align: top;
    }
</style>
