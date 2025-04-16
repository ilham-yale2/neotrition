<script lang="ts" setup>
    import Button from '@/components/ui/button/Button.vue';
    import ClientLayout from '@/layouts/client/AppLayout.vue';

</script>

<template>
    <ClientLayout title="Waiting Room">
        <div class="flex items-center w-full min-h-screen max-w-[80%] mx-auto">
            <div class="flex flex-wrap justify-center w-full">
                <div class="mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 24 24"><circle cx="12" cy="2" r="0" fill="#000"><animate attributeName="r" begin="0" calcMode="spline" dur="1.8s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000" transform="rotate(45 12 12)"><animate attributeName="r" begin="0.225s" calcMode="spline" dur="1.8s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000" transform="rotate(90 12 12)"><animate attributeName="r" begin="0.45s" calcMode="spline" dur="1.8s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000" transform="rotate(135 12 12)"><animate attributeName="r" begin="0.675s" calcMode="spline" dur="1.8s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000" transform="rotate(180 12 12)"><animate attributeName="r" begin="0.9s" calcMode="spline" dur="1.8s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000" transform="rotate(225 12 12)"><animate attributeName="r" begin="1.125s" calcMode="spline" dur="1.8s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000" transform="rotate(270 12 12)"><animate attributeName="r" begin="1.35s" calcMode="spline" dur="1.8s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="2" r="0" fill="#000" transform="rotate(315 12 12)"><animate attributeName="r" begin="1.575s" calcMode="spline" dur="1.8s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle></svg>
                </div>
                <div class="w-full mt-8 mb-4 text-2xl font-bold">
                    Anda sudah berhasil login, tinggal menunggu admin untuk menerima permintaan Anda untuk menggunakan aplikasi ini :)

                </div>
                <div class="w-full text-xl">
                    Anda dapat menghubungi admin melalui whatsapp untuk bantuan login cepat
                </div>
                <Button class="mt-4 text-white bg-green-500 hover:bg-green-700">
                    <span >
                        <svg class="!w-[30px] !h-[30px]" xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24"><path fill="#fff" d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"/></svg>
                    </span>
                    <span>
                        Whatsapp
                    </span>
                </Button>
            </div>
        </div>
    </ClientLayout>
</template>
