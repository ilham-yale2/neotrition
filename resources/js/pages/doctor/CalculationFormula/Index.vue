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
    import ActionTable from '@/components/ActionTable.vue';
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
    } from '@/components/ui/dialog'
    import Method from '@/components/Method.vue';
    interface props {
        data: {
            data: any[];
            meta: any;
        };
    }

    const props = defineProps<props>();


    const breadcrumbs = [
        {
            title: 'Perhitungan Formula',
            href: '/calculation-formula',
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
            key: 'medical_record_number',
            label: 'Nomor Rekam Medis',
        },
        {
            key: 'method',
            label: 'Metode',
        },
        {
            key: 'timestamp',
            label: 'Waktu',
        },
        {
            key: 'action',
            label: 'Action',
            render: (value: any) => {
                return h(ActionTable, {
                    actions: ['view'],
                    rowId: value.id,
                    onAction: handleAction,
                });
            }
        },
    ];

    const modalView = ref(false);

    // const formDelete = useForm({
    //     _method: 'delete',
    //     id: modalView.value.id,
    // });

    const handleAction = (action: any, id: number) => {
        if (action.type === 'delete') {
            // modalView.value.show = true;
            // modalView.value.id = action.rowId;
        }else{
            router.visit(route('calculation-formula.show', action.rowId));
        }
    };

    // const handleDelete = () => {
    //     formDelete.post(route('my-patients.destroy',  modalView.value.id), {
    //         preserveScroll: true,
    //         onSuccess: () => {
    //             modalView.value.show = false;
    //         },
    //         onError: () => {
    //         }
    //     });
    // };


</script>
<template>
    <Head title="Perhitungan Formula Saya" />
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
                        <h1 class="font-bold">Data Perhitungan Formula</h1>
                    </div>
                    <div>
                        <Button type="button" @click="modalView = true" variant="outline">
                            <Plus class="w-4 h-4" />
                            Buat baru
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Table :headers="headers" :data="props.data?.data || []" :pagination="props.data?.meta || {}" />
        </div>

        <Dialog v-model:open="modalView">
            <DialogContent class="w-full max-w-[90%] bg-[#4E4FEB] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]">

                <div class="grid gap-4 px-6 py-4 overflow-y-auto">
                    <Method/>
                </div>

            </DialogContent>
        </Dialog>
    </AppLayout>

</template>
