<script lang="ts" setup >

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Button from '../ui/button/Button.vue';
import { Link } from '@inertiajs/vue3';



const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    }
})

const data = props.data

</script>

<template>
    <div class="p-5">
        <div class="grid w-full grid-cols-12 gap-5">
            <Card class="col-span-3">
                <CardHeader>
                    <CardTitle>Permintaan Login</CardTitle>
                    <CardDescription>Jumlah Permintaan login oleh dokter</CardDescription>
                </CardHeader>
                <CardContent>
                    {{ data.requested_login.length }}
                </CardContent>
                <CardFooter class="justify-end w-full d-flex">
                    <Button :as="Link" :href="'/login-request'" class="!px-4 !py-1 !h-[unset] ">Lihat</Button>
                </CardFooter>
            </Card>
            <Card class="col-span-3">
                <CardHeader>
                    <CardTitle>Dokter</CardTitle>
                    <CardDescription>Jumlah Dokter Terdaftar</CardDescription>
                </CardHeader>
                <CardContent>
                    {{ data.doctors.length }}
                </CardContent>
            </Card>
            <Card class="col-span-3">
                <CardHeader>
                    <CardTitle>Pasien</CardTitle>
                    <CardDescription>Jumlah Pasien Keseluruhan</CardDescription>
                </CardHeader>
                <CardContent>
                    {{ data.patients.length }}
                </CardContent>
            </Card>
            <Card class="col-span-3">
                <CardHeader>
                    <CardTitle>Formula </CardTitle>
                    <CardDescription>Jumlah Keseluruhan Formula dibuat</CardDescription>
                </CardHeader>
                <CardContent>
                    {{ data.calculation_formulas.length }}
                </CardContent>
            </Card>
        </div>
    </div>
</template>
