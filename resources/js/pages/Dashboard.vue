<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/vue3';
import PlaceholderPattern from '../components/PlaceholderPattern.vue';
import Button from '@/components/ui/button/Button.vue';
import DashboardDoctor from '@/components/doctor/Dashboard.vue';
import DashboardAdmin from '@/components/admin/Dashboard.vue';
import { ref } from 'vue';
import Method from '@/components/Method.vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];
const props = defineProps({
    data: Object,
})
const page = usePage<SharedData>();
const user = page.props.auth.user;
</script>

<template>
    <Head title="Dashboard" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <template v-if="user.role == 'doctor'">
            <DashboardDoctor :user="user" />
        </template>
        <template v-else>
            <DashboardAdmin :user="user" :data="props.data || {}" />
        </template>
    </AppLayout>
</template>
