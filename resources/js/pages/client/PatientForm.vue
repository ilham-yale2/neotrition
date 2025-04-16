<script setup lang="ts">
    import ClientLayout from '@/layouts/client/AppLayout.vue';
    import InputGroup from '@/components/InputGroup.vue';
    import { useForm } from '@inertiajs/vue3';
    import { computed } from 'vue';

    const form = useForm({
        date_of_birth: '',
        date_formula: '',
        actual_age: 0,
        date_of_treatment: '',
        day_care: 0
    })

    interface PatientForm {
        label: string;
        required?: boolean;
        name: string;
        type: string;
        placeholder?: string;
        disabled?: boolean;
        size?: string;
        defaultValue?: any
    }

    const actualAge = computed(() => {

        form.actual_age = getDateDIF(form.date_of_birth, form.date_formula);
    });

    const dateOfTreatment = computed(() => {

        form.day_care = getDateDIF(form.date_of_treatment, form.date_formula);
    });

    const getDateDIF = (date1: any, date2: any) => {
        let age = 0;
        const start = new Date(date1);
        const end = new Date(date2);

        const startDay = start.getDate();
        const endDay = end.getDate();

        if (endDay >= startDay) {
            age =  endDay - startDay;
        } else {
            const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
            age =  (prevMonth - startDay) + endDay;
        }

        return age;

    }

    const patientFields: PatientForm[] = [
        {
            label: 'Nama Dokter (Residen/DPJP)',
            required: true,
            name: 'doctor_name',
            type: 'text',
            placeholder: 'Masukkan Nama Dokter',
            size: 'md:col-span-6',
        },
        {
            label: 'Nama Pasien ',
            required: true,
            name: 'patient_name',
            type: 'text',
            placeholder: 'Masukkan Nama Pasien',
            size: 'md:col-span-6',
        },
        {
            label: 'Tanggal Lahir Pasien ',
            required: true,
            name: 'date_of_birth',
            type: 'date',
            size: 'md:col-span-6',
        },
        {
            label: 'Tanggal Pembuatan Formula Cairan',
            required: true,
            name: 'date_formula',
            type: 'date',
            size: 'md:col-span-6',
        },
        {
            label: 'Usia Aktual Pasien (Hari)',
            required: true,
            name: 'actual_age',
            type: 'number',
            size: 'md:col-span-6',
            defaultValue: actualAge
        },
        {
            label: 'Usia Gestasi (Minggu)',
            required: true,
            name: 'gestational_age',
            type: 'number',
            size: 'md:col-span-6',
        },
        {
            label: 'Tanggal Masuk Perawatan (Tanggal/Bulan/Tahun)',
            required: true,
            name: 'date_of_treatment',
            type: 'date',
            size: 'md:col-span-6',
        },
        {
            label: 'Perawatan Hari Ke',
            required: true,
            name: 'day_care',
            type: 'number',
            size: 'md:col-span-6',
            defaultValue: dateOfTreatment
        },
        {
            label: 'Diagnosis',
            required: true,
            name: 'diagnosis',
            type: 'textarea',
            size: 'md:col-span-6',
            placeholder: 'Masukkan Diagnosis'
        },
        {
            label: 'Berat Aktual Pasien (Kg)',
            required: true,
            name: 'diagnosis',
            type: 'number',
            size: 'md:col-span-6',
            placeholder: '0.00'
        },
    ]
</script>

<template>
    <ClientLayout title="Patient Form" customClass="py-10">
        <div class="text-xl font-bold text-white md:text-2xl">Data Pasien</div>
        <!-- {{ form }} -->
        <div class="grid w-full grid-cols-12 p-5 mt-6 bg-white rounded-lg gap-7">
            <div :class="field.size" class="col-span-12" v-for="field in patientFields">
                <InputGroup :form="form" :label="field.label" :name="field.name" :type="field.type" :placeholder="field?.placeholder" :required="field.required" :disabled="field?.disabled" :defaultValue="field?.defaultValue"  />
            </div>
        </div>
    </ClientLayout>
</template>

