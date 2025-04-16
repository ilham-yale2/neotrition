<template>

    <Head :title="title">

    </Head>
    <div class="px-10 bg-gray-200 sm:px-16" :class="customClass">
        <slot/>

    </div>
</template>
<script>
    import { Head } from '@inertiajs/vue3';
    export default {
        props: ['title', 'customClass'],
        components: {Head},
        name: 'ClientLayout',
    }
</script>
