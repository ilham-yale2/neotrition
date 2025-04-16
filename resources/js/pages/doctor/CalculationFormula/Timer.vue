<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { Pause, Play } from 'lucide-vue-next';
const props = defineProps({
    form: {
        type: Object,
        required: true
    },
    paused: {
        typpe: Boolean,
        required: true
    },
    methodCalculation: {
        type: String,
        required: false,
    }
})

const emit = defineEmits(['update:paused']);

const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

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
  emit('update:paused', !props.paused);
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="flex items-center justify-end w-full font-mono text-2xl">
    <Button class="mr-5" type="button" @click="togglePaused" v-if="methodCalculation == 'manual'">
        <Pause v-if="props.paused == false"/>
        <Play v-else/>

        {{ props.paused ? 'Start' : 'Pause' }}
    </Button>
    <span v-if="hours > 0">{{ pad(hours) }}:</span>{{ pad(minutes) }}:{{ pad(seconds) }}
  </div>
</template>
