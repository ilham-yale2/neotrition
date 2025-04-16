<script setup lang="ts">
import NavFooter from '@/components/NavFooter.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/vue3';
import { BookOpen, Folder, LayoutGrid, KeyRound, HeartPulse, StethoscopeIcon, TimerReset } from 'lucide-vue-next';
import AppLogo from './AppLogo.vue';
import { type SharedData, type User } from '@/types';
import { onMounted, ref } from 'vue';

const page = usePage<SharedData>();
const user = page.props.auth.user as User;
const navItems = ref<{ title: string; items: NavItem[] }[]>([]);

onMounted(() => {

    if(user.role != 'doctor'){
        navItems.value = [
            {
                title: 'Main',
                items: [
                    {
                        title: 'Dashboard',
                        href: '/dashboard',
                        icon: LayoutGrid,
                    },
                ] as NavItem[]
            },
            {
                title: 'Master',
                items: [
                    {
                        title: 'Doctors',
                        href: route('doctor.index'),
                        icon: StethoscopeIcon,
                        activePaths: ['doctor.index'],
                    },
                    // {
                    //     title: 'Patients',
                    //     href: '/dashboard',
                    //     icon: HeartPulse,
                    // },
                ] as NavItem[]
            },
            {
                title: 'Administrasi',
                items: [
                    {
                        title: 'Permintaan Login',
                        href: '/login-request',
                        activePaths: ['login-request.index'],
                        icon: KeyRound,
                    },
                ] as NavItem[]
            },
        ];
    }else{
        navItems.value = [
            {
                title: 'Main',
                items: [
                    {
                        title: 'Dashboard',
                        href: '/dashboard',
                        icon: LayoutGrid,
                    },
                ] as NavItem[]
            },
            {
                title: 'Pages',
                items: [
                    {
                        title: 'Pasien Saya',
                        href: '/my-patients',
                        icon: HeartPulse,
                    },
                    {
                        title: 'Perhitungan Formula',
                        href: '/calculation-formula',
                        icon: TimerReset,
                    },
                ] as NavItem[]
            },
        ];
    }

});

const footerNavItems: NavItem[] = [
    {
        title: 'Github Repo',
        href: 'https://github.com/laravel/vue-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];
</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <Link :href="route('dashboard')">
                            <AppLogo />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <NavMain v-for="(navItem , ni) in navItems" :title="navItem.title" :items="navItem.items" :key="ni" />
        </SidebarContent>

        <SidebarFooter>
            <!-- <NavFooter :items="footerNavItems" /> -->
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
