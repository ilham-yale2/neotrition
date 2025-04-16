<script setup lang="ts">

import Button from '@/components/ui/button/Button.vue';
import Dialog from '@/components/ui/dialog/Dialog.vue';
import DialogContent from '@/components/ui/dialog/DialogContent.vue';
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue';
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue';
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue';
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue';
import Method from '@/components/Method.vue';
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';
const props = defineProps({
    user:{
        type: Object,
        required: true,
    }
})
const modalMethod = ref(false);

</script>

<template>
    <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="text-3xl text-center">Selamat Datang, {{user.name}}</div>
        <div class="flex justify-center w-full mt-3">
            <Button type="button" @click="modalMethod = true" class="mr-2 bg-blue-500 hover:bg-blue-600">Mulai Sekarang</Button>
            <Button :as="Link" :href="route('my-patients.create')" class="bg-amber-500 hover:bg-amber-600">Input Data Pasien</Button>
        </div>
    </div>

    <Dialog :open="modalMethod" @update:open="modalMethod = $event">
        <DialogContent class="w-full max-w-[90%] bg-[#4E4FEB] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]">

            <div class="grid gap-4 px-6 py-4 overflow-y-auto">
                <Method/>
            </div>

        </DialogContent>
    </Dialog>
</template>
