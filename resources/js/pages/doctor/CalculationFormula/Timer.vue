<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { Pause, Play } from 'lucide-vue-next';
import { PropType } from 'vue';
const props = defineProps({
    form: {
        type: Object,
        required: true
    },
    paused: {
        type: Boolean,
        required: true
    },
    methodCalculation: {
        type: String,
        required: false,
    },
    step: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['update:paused']);

const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const statusTimer = ref(false)

let intervalId: number;

const pad = (value: number) => {
  return value.toString().padStart(2, '0');
};

const startTimer = () => {
  intervalId = setInterval(() => {
    if(props.paused == false){
        seconds.value++;
        if (seconds.value >= 60) {
          seconds.value = 0;
          minutes.value++;
        }
        if (minutes.value >= 60) {
          minutes.value = 0;
          hours.value++;
        }
        props.form.time = props.form.time ? props.form.time + 1 : 1
    }
  }, 1000);
};

const togglePaused = () => {
    if (![null, '', undefined].includes(props.form['medical_record_number'])) {

        emit('update:paused', !props.paused);
    }
};

const handleScroll = () => {
    const formEl = document.getElementById('mainForm');
    if (formEl) {
        const rect = formEl.getBoundingClientRect();
        statusTimer.value = rect.top <= 0;
    }

};

onMounted(() => {
    startTimer();
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
    <div class="flex justify-end w-full">
        <div class="flex items-center justify-end font-mono text-2xl " :class="{ 'fixed bottom-[70px] left-7 py-2 rounded-lg px-7 z-[1000] bg-[#4E4FEB] text-white': statusTimer, '' : !statusTimer }">
          <Button class="mr-5" type="button" @click="togglePaused" v-if="methodCalculation == 'manual' && ![null, '', undefined].includes(props.form['medical_record_number'])">
              <Pause v-if="props.paused == false"/>
              <Play v-else/>

              {{ props.paused ? 'Start' : 'Pause' }}
          </Button>
          <span v-if="hours > 0">{{ pad(hours) }}:</span>{{ pad(minutes) }}:{{ pad(seconds) }}
        </div>
    </div>
</template>
