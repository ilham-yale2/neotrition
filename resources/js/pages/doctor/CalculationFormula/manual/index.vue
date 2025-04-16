<script setup lang="ts">
    import AppLayout from '@/layouts/AppLayout.vue';
    import { Head, router, useForm } from '@inertiajs/vue3';
    import PersonalData from '../PersonalData.vue';
    import Button from '@/components/ui/button/Button.vue';
    import { ref, watch } from 'vue';
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
        [key: string]: any;
    }>({
        time: 0,
        date_of_birth: '',
        date_formula: '',
        actual_age: 0,
        date_of_treatment: '',
        day_care: 0,
        actual_weight: 0,
        medical_record_number: null,
        patient_name: null,
        gestational_age: null
    })

    const steps = [
        'Patient Personal Data',
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
            CurrentStep.value++
        }
    }

    const backStep = () => {
        paused.value = false
        CurrentStep.value--

    }

    const submit = () => {
        form.submit('post', route('calculation-formula.store', 'manual'), {

        })

    }
    watch(form, () => {
        if (![null, undefined, ''].includes(form.medical_record_number)) {
            paused.value = false
        }else{
            paused.value = true
        }
    })
</script>
<template>
    <Head title="Manual" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="px-5 pt-5">

            <div class="text-xl font-bold md:text-2xl">NEOtrition manual</div>
            <div class="text-base font-bold md:text-xl" >{{ steps[CurrentStep] }}</div>
            <Timer :form="form" v-model:paused="paused" :methodCalculation="'manual'" :step="0"/>
        </div>
        <form action="/" ref="formRef" method="POST">
            <PersonalData :methodCalculation="'manual'" :patients="patients" :form="form" v-if="CurrentStep == 0" />
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
