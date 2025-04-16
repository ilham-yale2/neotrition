<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { Link } from '@inertiajs/vue3';

defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <div class="flex flex-wrap min-h-screen ">

        <div class="w-full md:w-[480px] bg-[#4E4FEB] text-white md:rounded-tr-3xl md:rounded-br-3xl">
            <div class="h-full px-10 py-10">
                <div class="mb-6">
                    <Link :href="route('home')" class="gap-2 font-medium ">
                        <div class="mb-1 text-2xl font-extrabold rounded-md md:text-3xl">
                            NEOTRITION
                        </div>
                        <span class="sr-only">{{ title }}</span>
                    </Link>
                    <div class="mt-4 space-y-2">
                        <h1 class="text-xl font-medium">{{ title }}</h1>
                        <p class="text-sm text-white">{{ description }}</p>
                    </div>
                </div>
                <slot />
            </div>
        </div>
        <div class="w-full md:w-[calc(100%-480px)]"></div>
    </div>
</template>

<style>
    input{
        color: black!important;
    }
</style>
