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
                    <Label for="agreement">I accept any <span @click="modalTnC = true" class="font-bold text-black underline cursor-pointer">terms and conditions</span></Label>
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
        <DialogContent  :button-close="false">
            <DialogHeader>
                <DialogTitle>
                    Terms and Conditions
                </DialogTitle>
                <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                </DialogDescription>
            </DialogHeader>

            <DialogFooter>
                <div class="w-full px-20">
                    <Button @click="modalTnC = false; form.agreement = 'true'" class="w-full">
                        I agree and accept any terms and conditions
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
