<script setup lang="ts">

    import ClientLayout from '@/layouts/client/AppLayout.vue';
    import {Head} from '@inertiajs/vue3';
    import { ref } from 'vue';
    const agree = ref(false);
    const inventors = [
        {
            name: "Prof. Rinawati Rohsiswatmo, M.D., Ph.D",
            specialist: "Neonatologist",
            position: "Advisor"
        },
        {
            name: "Putri Maharani Tristanita Marsubrin,M.D., Ph.D",
            specialist: "Neonatologist",
            position: "Team Leader"
        },
        {
            name: "Hardya Gustada Hikmahrachim,M.D., M.Epid",
            specialist: "Pediatric Resident",
            position: "Member: Methodology, Data Analysis",
        },
        {
            name: "Iqbal Taufiqqurrachman, M.D.",
            specialist: "General Practitioner",
            position: "Member: Calculator Development"
        }
    ]
    const tokenElement = document.querySelector('meta[name=csrf-token]');
    const token = tokenElement ? tokenElement.getAttribute('content') : null;
</script>

<template>
    <ClientLayout customClass="min-h-screen py-10" title="Welcome">
        <div class="mb-6 text-3xl font-semibold text-center text-white">
            NEOTRITION
        </div>
        <div class="flex flex-wrap w-full">
            <div class="w-full md:w-1/2">
                <div class="mb-5 text-2xl font-semibold text-white">Inventor</div>
                <div class="flex flex-wrap w-full">
                    <div v-for="inventor in inventors" class="flex flex-wrap justify-center w-full mb-10 sm:w-1/2 md:justify-start md:w-full">
                        <img class="w-24 h-24 rounded-full" :src="'https://ui-avatars.com/api/?name=' + inventor.name + '&size=200&background=random'" alt="">
                        <div class="w-full pr-2 pl-2 text-center md:text-left mt-5 md:mt-0 md:pl-6 md:pr-16 text-white md:w-[calc(100%-6rem)]">
                            <div class="text-base md:text-2xl">{{ inventor.name }}</div>
                            <div class="text-sm font-semibold md:text-lg">{{ inventor.specialist }}</div>
                            <div class="text-sm font-semibold md:text-lg">{{ inventor.position }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full text-white md:w-1/2">
                <div class="text-2xl font-semibold ">Informed Consent</div>
                <div class="mt-4 text-lg text-justify">
                    Kalkulator NEOtrition ini merupakan sebuah kalkulator
                    medik yang ditujukan untuk menghitung kebutuhan
                    cairan dan nutrisi parenteral total pada neonatus (0-
                    28 hari). Pada saat ini masih dalam proses
                    pengembangan untuk penelitian.
                    <br><br>
                    Dengan mengisi seluruh data pasien dan submit untuk
                    penghitungan kebutuhan cairan dan nutrisi parenteral
                    menggunakan aplikasi berbasis web ini, saya sebagai
                    klinis yang bertanggung jawab atas pasien
                    menyatakan setuju bahwa kondisi pasien akan
                    tercatat dalam database NEOtrition dan dapat
                    digunakan untuk publikasi dalam penelitian ilmiah
                    tanpa menyertakan nama pasien atau keluarga pasien.
                    <br><br>
                </div>

                <div class="text-xl font-bold">
                    Mohon untuk tidak menyebarkan akses sementara
                    NEOtrition sampai penelitian selesai dan launching
                    aplikasi dilakukan.
                </div>
                <form action="/patient-data" method="post" @submi.prevent="">
                    <input type="hidden" name="_token" :value="token">
                    <div class="flex items-start gap-3 mt-5 text-xl">
                        <input type="checkbox" v-model="agree" class="w-6 h-10 md:w-16"  id="agreement" value="1" required>
                        <label for="agreement" class="font-bold w-[calc(100%-1.5rem)] md:w-[calc(100%-4rem)]">Saya telah membaca dan menyetujui terkait
                            pengaplikasian dari web-app NEOtrition dan
                            tidak akan menyebarkan penggunaannya sampai
                            hasil penelitian selesai dan aplikasi di launching
                            secara luas
                        </label>
                    </div>
                    <div class="flex justify-center w-full mt-6">
                        <button :disabled="agree === false ? true : false" class="mt-5 text-black bg-slate-200 hover:bg-slate-300 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-full text-xl w-full sm:w-auto px-10 md:px-20 py-2.5 text-center"> Lanjut Gunakan Aplikasi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </ClientLayout>
</template>
