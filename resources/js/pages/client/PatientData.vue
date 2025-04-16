<script setup lang="ts">
    import ClientLayout from '@/layouts/client/AppLayout.vue';
    import { Link } from '@inertiajs/vue3';

    const methods =  [
                {
                    title: 'Metode',
                    subtitle: 'Manual',
                    items: [
                        'List Rekomendasi TPN untuk neonatus',
                        'Timer'
                    ]
                },
                {
                    title: 'NEOtrition',
                    subtitle: 'Individualized',
                    items: [
                        'Kalkulator otomatis untuk menghitung jumlah/volume yang dibutuhkan untuk kebutuhan TPN yang dibutuhkan',
                        'Peringatan akan efek TPN yang telah dikalkulasikan',
                        'Timer'
                    ]
                },
                {
                    title: 'NEOtrition',
                    subtitle: 'Starter',
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

    <ClientLayout title="Patient Data" customClass="min-h-screen py-10">
        <div class="mb-2 text-xl font-bold text-right text-white uppercase">neotrition</div>
        <div class="text-white">
            <div class="text-xl font-bold text-center md:text-4xl ">PILIH METODE FORMULASI TPN</div>
            <div class="md:w-[30%] mx-auto text-base md:text-xl text-center mt-6">Silahkan Dokter untuk memilih metode untuk menghitung formulasi TPN</div>
        </div>
        <div class="flex flex-wrap w-full mt-14">
            <div class="flex px-4 md:w-1/4" v-for="method in methods">
                <div class="flex flex-wrap w-full p-8 text-blue-800 duration-300 ease-in-out bg-white rounded-3xl hover:bg-blue-300 hover:text-white group">
                   <div class="w-full">
                        <div class="text-2xl font-semibold ">{{ method.title }}</div>
                        <div class="mt-3 text-3xl font-bold ">{{ method.subtitle }}</div>
                        <ul class="pb-6 pl-4 mt-6 list-disc">
                            <li v-for="item in method.items"> {{ item }} </li>
                        </ul>
                   </div>

                    <Link :href="route('patientForm')" class="w-full py-1 mt-auto text-2xl font-bold text-center text-blue-900 duration-300 ease-in-out bg-blue-400 rounded-full group-hover:bg-white group-hover:text-blue-300 ">MULAI</Link>
                </div>
            </div>
        </div>
    </ClientLayout>

</template>


