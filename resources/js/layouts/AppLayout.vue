<script setup lang="ts">
import { useToast } from '@/components/ui/toast';
import Toaster from '@/components/ui/toast/Toaster.vue';
import AppLayout from '@/layouts/app/AppSidebarLayout.vue';
import type { BreadcrumbItemType } from '@/types';
import { usePage } from '@inertiajs/vue3';
import { onMounted, watch } from 'vue';

interface Props {
    breadcrumbs?: BreadcrumbItemType[];
}

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});
const { toast } = useToast()

const showToast = (type: string, message: string, variant: 'default' | 'destructive' = 'default') => {
    console.log(message);

    toast({
        title: type,
        variant: variant,
        description: message,
    });
};

const handleToast = (newFlash: any) => {
  if (newFlash?.success) {
    showToast("Suceess", newFlash.success, 'default');
  }
  if (newFlash?.error) {
    showToast("Oops", newFlash.error, 'destructive');
  }
}

const page = usePage();

watch(
  () => page.props.flash,
  (newFlash) => {
    handleToast(newFlash);
  }
);

onMounted(() => {
  handleToast(page.props.flash);
});
</script>

<template>
    <Toaster />
    <AppLayout :breadcrumbs="breadcrumbs">
        <slot />
    </AppLayout>
</template>
