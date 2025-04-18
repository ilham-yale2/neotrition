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
    </div>
</template>
