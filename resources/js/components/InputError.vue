<script setup lang="ts">
defineProps<{
    message?: string;
    customClass?: string;
}>();
</script>

<template>
    <div v-show="message">
        <p class="text-sm text-red-500 dark:text-red-500" :class="customClass">
            {{ message }}
        </p>
    </div>
</template>
