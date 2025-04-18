<script setup lang="ts">
    import AppLayout from '@/layouts/AppLayout.vue';
    import { Head, useForm } from '@inertiajs/vue3';
    import { onMounted, ref } from 'vue';
    import { Link } from '@inertiajs/vue3';
    import Button from '@/components/ui/button/Button.vue';
    import {Card, CardContent} from '@/components/ui/card';
    import InputGroup from '@/components/InputGroup.vue';
    import { ArrowLeft } from 'lucide-vue-next';

    interface props {
        patient: any;
    }

    const props = defineProps<props>();

    const form = useForm({
        name: props.patient.name,
        medical_record_number: props.patient.medical_record_number,
        date_of_birth: props.patient.date_of_birth,
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

    const patientFields: PatientForm[] = [
        {
            label: 'Nama Pasien ',
            required: true,
            name: 'name',
            type: 'text',
            placeholder: 'Masukkan Nama Pasien',
            size: 'md:col-span-6',
        },
        {
            label: 'Nomor Rekam Medis ',
            required: true,
            name: 'medical_record_number',
            type: 'text',
            placeholder: 'Masukkan Nomor Rekam Medis',
            size: 'md:col-span-6',
        },
        {
            label: 'Tanggal Lahir Pasien ',
            required: true,
            name: 'date_of_birth',
            type: 'date',
            size: 'md:col-span-6',
        },
    ]


    const breadcrumbs = [
        {
            title: 'My Patients',
            href: '/my-patients',
        },
    ]

    const alert = ref({
        show: false,
        message: '',
        type: 'success',
        title: ''
    });

    const handleForm = () => {
        form.post(route('my-patients.store'), {
            onSuccess: (page: any) => {
                // alert.value.show = true;
                // alert.value.message = page?.props?.flash.message;
                // alert.value.type = 'success';
                // alert.value.title = 'Success';
            },
            onError: (errors) => {
                alert.value.show = true;
                alert.value.message = errors[0];
                alert.value.type = 'error';
                alert.value.title = 'Error';
            }
        })
    }

</script>
<template>
    <Head title="My Patients" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex flex-col flex-1 h-full gap-4 p-4 rounded-xl">
            <Card>
                <CardContent class="flex items-center justify-between p-4">
                    <div>
                        <h1 class="font-bold">New Patient</h1>
                    </div>
                    <div>
                        <Button :as="Link" :href="route('my-patients.index')" variant="outline">
                            <ArrowLeft class="w-4 h-4" />
                            Back
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent class="p-4 ">
                    <form :action="route('my-patients.update', props.patient.id)" method="POST" @submit.prevent="handleForm">
                        <input type="hidden" name="_method" value="PUT">
                        <div class="grid w-full grid-cols-12 bg-white rounded-lg gap-7">
                            <div :class="field.size" class="col-span-12" v-for="field in patientFields" :key="field.name">
                                <InputGroup :form="form" :label="field.label" :name="field.name" :type="field.type" :placeholder="field?.placeholder" :required="field.required" :disabled="field?.disabled" :defaultValue="field?.defaultValue"  />
                            </div>
                        </div>
                        <div class="flex justify-end w-full gap-3">
                            <Button type="submit" class="mt-4" :disabled="form.processing">
                                {{ form.processing ? 'Loading...' : 'Submit' }}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>

</template>
