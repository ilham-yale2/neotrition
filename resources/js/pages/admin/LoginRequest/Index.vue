<script setup lang="ts">
    import AppLayout from '@/layouts/AppLayout.vue';
    import { Head, router, useForm } from '@inertiajs/vue3';
    import { h, ref, render } from 'vue';
    import { Link } from '@inertiajs/vue3';
    import Button from '@/components/ui/button/Button.vue';
    import Table from '@/components/Table.vue';
    import {Card, CardContent} from '@/components/ui/card';
    import { CircleAlert, LoaderCircleIcon, Plus } from 'lucide-vue-next';
    import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
    import ActionTable from './ActionTable.vue';
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
    } from '@/components/ui/dialog'
    interface props {
        doctors: {
            data: any[];
            meta: any;
        };
    }

    const props = defineProps<props>();


    const breadcrumbs = [
        {
            title: 'Login Request',
            href: '/doctor',
        },
    ]

    const alert = ref({
        show: false,
        message: '',
        type: 'success',
        title: ''
    });

    const headers: any[] = [
        {
            key: 'number',
            label: 'No',
            render: (value: any, index: number) => {
                return h('div', index + 1);
            }
        },
        {
            key: 'name',
            label: 'Name',
        },
        {
            key: 'email',
            label: 'Email',
        },
        {
            key: 'patient_count',
            label: 'Patients',
        },
        {
            key: 'timestamp',
            label: 'Timestamp',
        },
        {
            key: 'action',
            label: 'Action',
            render: (value: any) => {
                return h(ActionTable, {
                    actions: ['view'],
                    rowId: value.id,
                    showLabels: true,
                    onAction: handleAction,
                });
            }
        }
    ];

    const modalView = ref<any>({
        show: false,
        id: null,
    });

    const formLogin = useForm({
        _method: 'post',
        id: modalView.value.id,
    });

    const handleAction = (action: any, id: number) => {
        if (action.type === 'view') {
            modalView.value.show = true;
            modalView.value.id = action.rowId;

            formLogin.id = action.rowId
        }
    };

    const handleLogin = () => {

        formLogin.post(route('login-request.store', {doctor: modalView.value.id}), {
            preserveScroll: true,
            onSuccess: () => {
                modalView.value.show = false;
            },
            onError: () => {
            }
        });
    };


</script>
<template>
    <Head title="Login Request" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex flex-col flex-1 h-full gap-4 p-4 rounded-xl">
            <Alert v-if="alert.show">
                <LoaderCircleIcon v-if="alert.type === 'wait'" class="w-4 h-4 animate-spin" />
                <LoaderCircleIcon v-if="alert.type === 'success'" class="w-4 h-4 animate-spin" />
                <CircleAlert v-if="alert.type === 'error'" class="w-5 h-5" />
                <AlertTitle>{{ alert.title }}</AlertTitle>
                <AlertDescription> {{ alert.message }} </AlertDescription>
            </Alert>

            <Card>
                <CardContent class="flex items-center justify-between p-4">
                    <div>
                        <h1 class="font-bold">Permintaan Login</h1>
                    </div>

                </CardContent>
            </Card>

            <Table :headers="headers" :data="props.doctors?.data || []" :pagination="props.doctors?.meta || {}" />
        </div>
        <Dialog :open="modalView.show">
            <DialogContent class="sm:max-w-[425px]" :button-close="false">
                <DialogHeader>
                    <DialogTitle>Apakah anda yakin menyetujui Login?</DialogTitle>
                    <DialogDescription>
                        Dokter akan dizinkan untuk menggunakan aplikasi ini
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button type="button" variant="outline" @click="modalView.show = false; modalView.id = null">
                        Cancel
                    </Button>
                    <Button type="button" variant="destructive" @click="handleLogin" :disabled="formLogin.processing">
                        {{ formLogin.processing ? 'Loading...' : 'Ya, Setujui' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>

</template>
