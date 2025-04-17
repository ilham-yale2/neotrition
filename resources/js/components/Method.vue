<script setup>
import { Link } from '@inertiajs/vue3';
const methods =  [
                {
                    title: 'Metode',
                    subtitle: 'Manual',
                    disabled: false,
                    items: [
                        'List Rekomendasi TPN untuk neonatus',
                        'Timer'
                    ]
                },
                {
                    title: 'NEOtrition',
                    subtitle: 'Individualized',
                    disabled: false,
                    items: [
                        'Kalkulator otomatis untuk menghitung jumlah/volume yang dibutuhkan untuk kebutuhan TPN yang dibutuhkan',
                        'Peringatan akan efek TPN yang telah dikalkulasikan',
                        'Timer'
                    ]
                },
                {
                    title: 'NEOtrition',
                    subtitle: 'Starter',
                    disabled: false,
                    items: [
                        'Kalkulator otomatis untuk menghitung jumlah/volume yang dibutuhkan untuk kebutuhan TPN yang dibutuhkan',
                        'Sesuai rumus PG1',
                        'Peringatan akan efek TPN yang telah dikalkulasikan',
                        'Timer'
                    ]
                },
                {
                    title: 'NEOtrition',
                    subtitle: 'PG2',
                    disabled: false,
                    items: [
                        'Kalkulator otomatis untuk menghitung jumlah/volume yang dibutuhkan untuk kebutuhan TPN yang dibutuhkan',
                        'Sesuai rumus PG2',
                        'Peringatan akan efek TPN yang telah dikalkulasikan',
                        'Timer',
                    ]
                }
            ]
</script>
<template>
    <div class="text-white">
            <div class="text-xl font-bold text-center md:text-3xl ">PILIH METODE FORMULASI TPN</div>
            <div class="md:w-[60%] mx-auto text-base md:text-xl text-center mt-2">Silahkan Dokter untuk memilih metode untuk menghitung formulasi TPN</div>
            <div class="md:w-[60%] mx-auto text-sm md:text-xl text-center mt-2">Pastikan Anda telah memiliki data pasien yang sudah di input</div>
        </div>
        <div class="flex flex-wrap w-full mt-5">
            <div class="flex w-1/2 px-2 mb-4 md:px-4 md:w-1/4" v-for="method in methods" :key="method">
                <div class="flex flex-wrap w-full p-4 text-blue-800 duration-300 ease-in-out bg-white md:p-8 rounded-xl md:rounded-3xl hover:bg-blue-300 hover:text-black group">
                   <div class="w-full">
                        <div class="text-xl font-semibold ">{{ method.title }}</div>
                        <div class="mt-1 text-2xl font-bold ">{{ method.subtitle }}</div>
                        <ul class="pb-2 pl-4 mt-6 list-disc">
                            <li v-for="item in method.items" :key="item"> {{ item }} </li>
                        </ul>
                   </div>

                    <Link v-if="method.disabled == false" :href="route('calculation-formula.create', {method: method.subtitle.toLowerCase()})" class="w-full py-1 mt-auto text-2xl font-bold text-center text-blue-900 duration-300 ease-in-out bg-blue-400 rounded-full group-hover:bg-white group-hover:text-black ">MULAI</Link>
                </div>
            </div>
        </div>
</template>
