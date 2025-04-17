<script setup lang="ts">
    import AppLayout from '@/layouts/AppLayout.vue';
    import { Head, router, useForm } from '@inertiajs/vue3';
    import PersonalData from '../PersonalData.vue';
    import Button from '@/components/ui/button/Button.vue';
    import { onMounted, ref } from 'vue';
    import FormCalculation from './form.vue';
    import Result from './result.vue';
    import Timer from '../Timer.vue';

    const props = defineProps({
        patients: {
            type: Object,
            required: true
        }
    })

    const breadcrumbs = [
        {
            title: 'Calculation Formula',
            href: '/calculation-formula',
        },
    ]
    const form = useForm<{
        date_of_birth: string;
        date_formula: string;
        actual_age: number;
        date_of_treatment: string;
        day_care: number;
        clinical_sensation: string;
        [key: string]: any;
    }>({
        time: 0,
        date_of_birth: '',
        date_formula: '',
        actual_age: 0,
        clinical_sensation: '',
        date_of_treatment: '',
        day_care: 0,
        insensible_water_loss_volume: null,
        input_fluid_volume: null,
        output_fluid_volume: null,
        daily_balance: null,
        daily_balance_volume: null,
        insensible_water_loss: null,
        medical_record_number: null,
        patient_name: null,
        gestational_age: null,
        actual_weight: null,
        hemoglobin: null,
        natrium: null,
        kalium: null,
        chloride: null,
        magnesium: null,
        phosphate: null,
        calcium: null,
        glucose: null,
        ureum: null,
        creatinine: null,
        infant_warmer: null,
        phototherapy: null,
        humidity_incubator: null,
        infant_wrapping: null,
        current_temperature: null,
        calculated_fluid_volume: null,
        other_transfusion_total: null,
        fluid_volume_per_day: null,
        formula_warning_total_volume_note: null,
        formula_warning_balance_estimate: null,
        formula_warning_balance_volume: null,
        total_fluid_volume: null,
        other_transfusion_name: null,
        nutrition_name: null,
        parental_name: null,
        parental_need: null,
        parental_daily: null,
        parental_rate_continue: null,
        other_transfusion_need: null,
        other_transfusion_amount_transfusion: null,
        other_transfusion_duration: null,
        other_transfusion_rate: null,
        correction_continue_target: null,
        correction_continue_dilution: null,
        correction_continue_duration: null,
        correction_continue_correction_rate: null,
        correction_continue_total_volume: null,
        setup_continue_name: null,
        setup_continue_rate: null,
        setup_continue_duration: null,
        setup_continue_total_fluid: null,
        setup_intermitten_name: null,
        setup_intermitten_need: null,
        setup_intermitten_frequency: null,
        setup_intermitten_total_fluid: null,
        correction_intermitten_need: null,
        correction_intermitten_dilution: null,
        correction_intermitten_frequence: null,
        correction_intermitten_daily_total: null,
        prc_transfusion_hb_target: null,
        prc_transfusion_amount_transfusion: null,
        prc_transfusion_ratio: null,
        prc_transfusion_duration: null,
        prc_transfusion_rate: null,
        pg_volume: null,
        pg_total: null,
        pg_needs: null,
        pg_estimate: null,
        total_fluid_continue: null,
        total_fluid_intermitten: null,
        nutrition_need: null,
        nutrition_calories: null,
        nutrition_interval: null,
        nutrition_volume: null,
        nutrition_total: null,
        non_dextrose_total: null,
        non_dextrose_volume: null,
        non_dextrose_name: null,
        dextrose: null,
        formula_warning_note: null,
        warning_nutrition_note: null,
        warning_nutrition_formula: null,
        correction_continue_total_fluid: null,
        parental_total: null,
        formula_warning_electrolyte_estimate: null,
        formula_warning_electrolyte_daily_dose: null,
        input_fluid: 0,
        output_fluid: 0,
        time_calculation: 0,
        calculated_formula: 0
    })

    const steps = [
        'Patient Personal Data',
        'PENGHITUNGAN CAIRAN DAN NUTRISI PARENTERAL',
        'RESEP NEOtrition - Starter'
    ]

    const CurrentStep = ref(0);
    const paused = ref(true)
    const formRef = ref<HTMLFormElement | null>(null)

    const nextStep = () => {
        let isValid = false
        if (CurrentStep.value == 1) {
            paused.value = true
        }

        const formEL = formRef.value

        if (formEL && formEL.checkValidity()) {

            isValid = true
        } else if (formEL) {
            formEL.reportValidity()
        }

        if (isValid){
            if (CurrentStep.value == 1) {
                paused.value = true
            }else{

                paused.value = false
            }
            CurrentStep.value++
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    const backStep = () => {
        paused.value = false
        CurrentStep.value--

    }

    const submit = () => {
        form.submit('post', route('calculation-formula.store', 'pg2'), {

        })

    }

    // onMounted(() => {
    //     form['date_of_birth'] = '2011-11-11'
    //     form['date_formula'] = '2025-04-14'
    //     form['medical_record_number'] = '5'
    //     form['actual_age'] = 3
    //     form['actual_weight'] = 3.3
    //     form['patient_name'] = 'Amediketu'
    //     form['gestational_age'] = 2
    //     form['date_of_treatment'] = '2025-04-13'
    //     form['day_care'] = 1
    //     form['clinical_sensation'] = '1'
    //     form['natrium'] = 2
    //     form['infant_warmer'] = 1
    //     form['phototherapy'] = 1
    //     form['humidity_incubator'] = 1
    //     form['time_calculation'] = 4
    //     form['input_fluid'] = 7
    // })
</script>
<template>
    <Head title="Starter" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="px-5 pt-5">

            <div class="text-xl font-bold md:text-2xl">NEOtrition Starter</div>
            <div class="text-base font-bold md:text-xl" >{{ steps[CurrentStep] }}</div>
            <Timer :form="form" :paused="paused" :step="CurrentStep"/>
        </div>
        <form id="mainForm" action="/" ref="formRef" method="POST">
            <PersonalData :patients="patients" :form="form" v-if="CurrentStep == 0" />
            <FormCalculation :form="form" v-if="CurrentStep == 1" />
            <Result :patients="patients" :form="form" v-if="CurrentStep == 2" />
            <div class="flex justify-end w-full gap-6 p-10">
                <Button v-if="CurrentStep > 0" @click="backStep" variant="outline" type="button">Back</Button>
                <Button v-if="CurrentStep < steps.length - 1" @click="nextStep" type="button">Next Step</Button>
                <Button v-if="CurrentStep == steps.length - 1" type="button" @click="submit">Simpan dan selesaikan</Button>
            </div>
        </form>
    </AppLayout>

</template>


<style>
    input{
        opacity: 1!important;
    }
</style>
