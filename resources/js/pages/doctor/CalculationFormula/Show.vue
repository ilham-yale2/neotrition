<script setup lang="ts">
    import AppLayout from '@/layouts/AppLayout.vue';
    import { Head, router, useForm } from '@inertiajs/vue3';
    import { h, ref, render } from 'vue';
    import { Link } from '@inertiajs/vue3';
    import ParentalGlukoseResult from './pg2/result.vue';
    import IndividualizedResult from './individualized/result.vue';
    import StarterResult from './starter/result.vue';
    import Manual from './manual/result.vue'
    import Timer from './Timer.vue';
import Button from '@/components/ui/button/Button.vue';

    const props = defineProps({
        form: {
            type: Object,
            required: true
        }
    })

    const breadcrumbs = [
        {
            title: 'Perhitungan Formula',
            href: '/calculation-formula',
        },
    ]
</script>

<template>
   <Head title="Resep Formulasi TPN" />
   <AppLayout :breadcrumbs="breadcrumbs">
        <div class="px-5 pt-5">
            <div class="text-xl font-bold md:text-2xl">NEOtrition</div>
            <div class="text-base font-bold md:text-xl" >RESEP Formulasi TPN - {{ form['method_aliases'] }}</div>
            <Timer :form="form || {}" :paused="true" :step="2"/>
        </div>
        <ParentalGlukoseResult :form="form || {}"  v-if="form && form['method'] == 'pg2'"/>
        <IndividualizedResult :form="form || {}"  v-if="form && form['method'] == 'individualized'"/>
        <StarterResult :form="form || {}"  v-if="form && form['method'] == 'starter'"/>
        <Manual :form="form || {}"  v-if="form && form['method'] == 'manual'"/>
        <div class="flex justify-end w-full gap-6 p-10">
            <Button :as="Link" :href="route('calculation-formula.index')" type="button">Back</Button>
        </div>
    </AppLayout>

</template>
