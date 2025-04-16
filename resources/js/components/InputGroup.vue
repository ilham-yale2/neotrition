<script setup lang="ts">
import { InertiaForm } from '@inertiajs/vue3';
import { computed, defineProps, ref } from 'vue';
import InputError from './InputError.vue';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from '@/components/ui/textarea';
interface Props {
    form: InertiaForm<any>;
    name: string;
    label?: string;
    id?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    tabindex?: number;
    accept?: string;
    rows?: number;
    disabled?: boolean;
    preview?: boolean;
    reference?: any;
    defaultValue?: any;
    options?: Array<{ label: string; value: any }>;
    handleChange?: (event: any) => void;
    className?: string;
    rootClassName?: string;
    index?: any;
    min?: number;
    max?: number;
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    required: false,
    tabindex: 0,
});

const previewedImage = ref<string | null>(props.defaultValue);

const handleFormatPrice = () => {
    const value = props.form[props.name];
    const price = value.replace(/\D/g, '');
    const formattedPrice = new Intl.NumberFormat('id-ID', { currency: 'IDR' }).format(price);
    props.form[props.name] = isNaN(price) ? 0 : formattedPrice;
};

const handlePreview = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0] && props.preview) {
        const file = target.files[0];
        previewedImage.value = URL.createObjectURL(file);
    }else{
        previewedImage.value = null;

    }
}

const modelValue = computed({
  get: () => (props.index !== undefined ? (props.form[props.name] != null ? props.form[props.name][props.index] : props.form[props.name]) : props.form[props.name]),
  set: (value) => {

    if (props.index !== undefined) {

      props.form[props.name][props.index] = props.type == 'number' && value < 0 ? 0 : value;
    } else {
      props.form[props.name] = props.type == 'number' && value < 0 ? 0 : value;
    }
  },
});
</script>

<template>
    <div class="grid gap-2" :class="rootClassName">
        <div v-if="label" class="flex items-center justify-between">
        <Label :for="id || name">{{ label }} <span class="text-red-500" v-if="required">*</span></Label>
        </div>
        <Input
            v-if="type === 'price'"
            :id="id || name"
            :name="handleChange ? '' : name"
            type="text"
            :tabindex="tabindex"
            v-model="form[name]"
            :placeholder="placeholder"
            :required="required || false"
            :onblur="handleFormatPrice"
            :disabled="disabled || false"
        />
        <Textarea
            v-else-if="type === 'textarea'"
            :id="id || name"
            :name="name"
            :tabindex="tabindex"
            v-model="form[name]"
            :placeholder="placeholder"
            :required="required || false"
            :rows="rows || 3"
            :disabled="disabled || false"
        >
        </Textarea>
        <div v-else-if="type === 'file'">
            <Input
                :id="id || name"
                :name="name"
                type="file"
                :ref="reference"
                :tabindex="tabindex"
                @input="handleChange ? handleChange($event) : (form[name] = $event.target.files[0]); handlePreview($event)"
                :placeholder="placeholder"
                :accept="accept || ''"
                :required="required || false"
                :disabled="disabled || false"
            />
        </div>

        <template v-else-if="type == 'select'">
            <select
                :id="id || name"
                :name="name"
                :tabindex="tabindex"
                v-model="modelValue"
                :placeholder="placeholder"
                :required="required || false"
                :disabled="disabled || false"
                @change="handleChange ? handleChange($event) : null"
                class="flex w-full h-10 px-3 py-2 text-base border rounded-md border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
                <option value="" disabled hidden>Select Option</option>
                <option v-for="(option, index) in options" :key="index" :selected="option.value == defaultValue" :value="option.value">{{ option.label }}</option>
            </select>
        </template>
        <template v-else-if="type == 'radio-option'">
            <div class="flex items-center w-full" :class="className">
                <div v-for="(option, index) in options" :key="index" class="flex items-center">
                    <input
                        type="radio"
                        :id="id || name + index"
                        :value="option.value"
                        :name="name"
                        :tabindex="tabindex"
                        v-model="form[name]"
                        @change="handleChange ? handleChange($event) : null"
                        :required="required || false"
                    />
                    <label :for="id || name + index" class="ml-2 text-sm">{{ option.label }}</label>
                </div>
            </div>
        </template>
        <Input
            v-else
            :id="id || name"
            :name="name"
            :type="type || 'text'"
            :tabindex="tabindex"
            v-model="modelValue"
            :placeholder="placeholder"
            :required="required || false"
            :disabled="disabled || false"
            :min="min || null"
            :step="'any'"
            :max="max || null"
            @keydown="['ArrowUp','ArrowDown'].includes($event.key) && $event.preventDefault()"
            @input="handleChange ? handleChange($event) : null"
        />
        <InputError v-if="form?.errors" :message="form.errors[name]" />
        <div v-if="(previewedImage ?? defaultValue) && preview" class="pt-6">
            <img :src="previewedImage ?? defaultValue" class="object-contain object-top w-full max-h-48" />
        </div>
    </div>
</template>

<style scoped>
    input:focus-visible, textarea:focus-visible {
        outline: none!important;
        --tw-ring-color: unset!important;
    }
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }

    /* Firefox */
    input[type="number"] {
    -moz-appearance: textfield;
    }
</style>
