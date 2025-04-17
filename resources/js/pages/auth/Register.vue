<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthBase from '@/layouts/AuthLayout.vue';
import { Head, useForm } from '@inertiajs/vue3';
import { LoaderCircle } from 'lucide-vue-next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ref } from 'vue';

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    agreement: '',
});

const modalTnC = ref(false);

const submit = () => {
    if (form.agreement !== 'true') {
        modalTnC.value = true;
    }else{
        form.post(route('register'), {
            onFinish: () => form.reset('password', 'password_confirmation'),
        });

    }
};

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
</script>

<template>
    <AuthBase title="Create an account" description="Enter your details below to create your account">
        <Head title="Register" />
        <form @submit.prevent="submit" class="flex flex-col gap-6">
            <div class="grid gap-6">
                <div class="grid gap-2">
                    <Label for="name">Doctor Name</Label>
                    <Input id="name" type="text" required autofocus :tabindex="1" autocomplete="name" v-model="form.name" placeholder="Full name" />
                    <InputError :custom-class="'text-white'" :message="form.errors.name" />
                </div>

                <div class="grid gap-2">
                    <Label for="email">Email address</Label>
                    <Input id="email" type="email" required :tabindex="2" autocomplete="email" v-model="form.email" placeholder="email@example.com" />
                    <InputError :custom-class="'text-white'" :message="form.errors.email" />
                </div>

                <div class="grid gap-2">
                    <Label for="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        required
                        :tabindex="3"
                        autocomplete="new-password"
                        v-model="form.password"
                        placeholder="Password"
                    />
                    <InputError :custom-class="'text-white'" :message="form.errors.password" />
                </div>

                <div class="grid gap-2">
                    <Label for="password_confirmation">Confirm password</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        required
                        :tabindex="4"
                        autocomplete="new-password"
                        v-model="form.password_confirmation"
                        placeholder="Confirm password"
                    />
                    <InputError :custom-class="'text-white'" :message="form.errors.password_confirmation" />
                </div>

                <div class="flex items-center justify-center w-full gap-3">
                    <Input type="checkbox" id="agreement" class="h-[20px] !w-[20px]" required :value="'true'" :checked="form.agreement == 'true' ? true : false" v-model="form.agreement"/>
                    <div>
                        <Label for="agreement">I accept any </Label>
                        <span @click="modalTnC = true" class="font-bold text-black underline cursor-pointer">terms and conditions</span>
                    </div>
                </div>

                <Button type="submit" class="w-full mt-2" tabindex="5" :disabled="form.processing">
                    <LoaderCircle v-if="form.processing" class="w-4 h-4 animate-spin" />
                    Create account
                </Button>
            </div>
            <div class="text-sm text-center text-white">
                Already have an account?
                <TextLink :href="route('login')" class="text-white underline underline-offset-4" :tabindex="6">Log in here</TextLink>
            </div>
        </form>
    </AuthBase>

    <Dialog :open="modalTnC" @update:open="modalTnC = $event">
        <DialogContent class="sm:max-w-[90%] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]">
        <DialogHeader class="p-6 pb-0">
            <DialogTitle>
                Terms and Conditions
            </DialogTitle>
            <DialogDescription>
                Make changes to your profile here. Click save when you're done.
            </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 px-6 py-4 overflow-y-auto">
            <div class="flex flex-wrap w-full px-4 max-h-[900px]">
                <div class="w-full md:w-1/2">
                    <div class="mb-5 text-2xl font-semibold">Inventor</div>
                    <div class="flex flex-wrap w-full">
                        <div v-for="inventor in inventors" class="flex flex-wrap justify-center w-full mb-6 sm:w-1/2 md:justify-start md:w-full">
                            <img class="w-20 h-20 rounded-full" :src="'https://ui-avatars.com/api/?name=' + inventor.name + '&size=200&background=random'" alt="">
                            <div class="w-full pr-2 pl-2 text-center md:text-left mt-5 md:mt-0 md:pl-6 md:pr-16 md:w-[calc(100%-6rem)]">
                                <div class="text-base md:text-xl">{{ inventor.name }}</div>
                                <div class="text-sm font-semibold md:text-base">{{ inventor.specialist }}</div>
                                <div class="text-sm font-semibold md:text-base">{{ inventor.position }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-1/2">
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
                </div>
            </div>
        </div>
        <DialogFooter>
            <div class="flex justify-end w-full p-6 pt-0">
                <Button @click="modalTnC = false; form.agreement = 'true'" class="">
                    I agree and accept any terms and conditions
                </Button>
            </div>
        </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
