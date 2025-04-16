<script setup lang="ts">
    import { computed, ref } from 'vue';
    import {onMounted} from 'vue';
    import Button from '@/components/ui/button/Button.vue';
    import InputGroup from '@/components/InputGroup.vue';
    import Dialog from '@/components/ui/dialog/Dialog.vue';
    import DialogContent from '@/components/ui/dialog/DialogContent.vue';
    import DialogHeader from '@/components/ui/dialog/DialogHeader.vue';
    import DialogTitle from '@/components/ui/dialog/DialogTitle.vue';
    import DialogFooter from '@/components/ui/dialog/DialogFooter.vue';
    import {checkValueNumber} from '@/lib/utils';


    const props = defineProps({
        form: {
            type: Object,
            required: true
        },
        patients: {
            type: Object,
            required: true
        },
        methodCalculation: {
            type: String,
            required: false
        }
    })

    const form = props.form

    interface fieldInterface {
        label: string;
        required?: boolean;
        name: string;
        type: string;
        placeholder?: string;
        disabled?: boolean;
        size?: string;
        defaultValue?: any
        options?:any;
        handleChange?: (event: Event) => void;
        max?: number
    }

    const actualAge = computed(() => {

        form.actual_age = getDateDIF(form.date_of_birth, form.date_formula, 'date_formula');
    });

    const dateOfTreatment = computed(() => {

        form.day_care = getDateDIF(form.date_of_treatment, form.date_formula, 'date_of_treatment');
    });

    const getDateDIF = (startDate: any, endDate: any, target?: any) => {
        if (!startDate || !endDate) return 0;

        const start = new Date(startDate);
        const end = new Date(endDate);

        const startDay = start.getDate();
        const endDay = end.getDate();

        if (end < start) {

            form[target] = '';

            const element = document.getElementById(target) as HTMLInputElement;
            if (element) {
                element.value = '';
                element.dispatchEvent(new Event('input'));
            }

            alert('Tanggal akhir tidak boleh lebih kecil dari tanggal awal');

            return 0;

        }

        if (endDay >= startDay) {

            return endDay - startDay;
        } else {

            const daysInPrevMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
            return (daysInPrevMonth - startDay) + endDay;
        }

    }

    const handleMedicalRecordChange = (event: Event) => {
        const target = event.target as HTMLSelectElement;
        const selectedOption = target.options[target.selectedIndex];
        const selectedValue = selectedOption.value;
        const selectedPatient = props.patients.find((patient: any) => patient.value.toString() === selectedValue);
        form.medical_record_number = selectedValue;
        form.patient_name = selectedPatient?.name || '';
        form.date_of_birth = selectedPatient?.date_of_birth || '';

    };

    const getInsensibleWaterLoss = computed(() => {
        let nilaiDasar;

        if (form['actual_weight'] >= 0.75 && form['actual_weight'] <= 1) {
            nilaiDasar = 82 * form['actual_weight'];
        } else if (form['actual_weight'] > 1 && form['actual_weight'] <= 1.25) {
            nilaiDasar = 56 * form['actual_weight'];
        } else if (form['actual_weight'] > 1.25 && form['actual_weight'] <= 1.5) {
            nilaiDasar = 46 * form['actual_weight'];
        } else {
            nilaiDasar = 26 * form['actual_weight'];
        }

        // kondisi lingkungan
        let faktor = 1;

        if (parseFloat(form['infant_warmer']) === 1) faktor += 0.5;
        if (parseFloat(form['phototherapy']) === 1) faktor += 0.5;
        if (parseFloat(form['humidity_incubator']) === 1) faktor -= 0.3;
        if (parseFloat(form['infant_wrapping']) === 1) faktor -= 0.3;

        if (form['current_temperature'] > 37.5) {
            faktor += ((form['current_temperature'] - 37.5) / 1) * 0.3;
        }

        const result = checkValueNumber(nilaiDasar * faktor).toFixed(2);
        form['insensible_water_loss'] = result;

        return result;
    })

    const getDailyBalansVolume = (fieldName: string) => {
        if (fieldName != 'daily_balance') {
            const result = checkValueNumber(form[fieldName] / form['actual_weight']).toFixed(1);
            form[fieldName+'_volume'] = result;
            return result
        }else{
            try {

                const daily_balance = (parseFloat(form['input_fluid']) * (24 / parseFloat(form['time_calculation']))) - (parseFloat(form['insensible_water_loss']) + (parseFloat(form['output_fluid']) * (24 / parseFloat(form['time_calculation']))));


                if (!isFinite(daily_balance)) {
                    form['daily_balance'] = 0;
                    form['daily_balance_volume'] = 0;
                    return 0;
                }

                form['daily_balance'] = daily_balance.toFixed(1)
                form['daily_balance_volume'] = checkValueNumber(daily_balance / form['actual_weight']).toFixed(1);

                return daily_balance;
            } catch (e) {
                form['daily_balance'] = 0
                form['daily_balance_volume'] = 0
                return 0;
            }
        }
    };


    const patientFields: fieldInterface[] = [
        {
            label: 'No Rekam Medis',
            required: true,
            name: 'medical_record_number',
            type: 'select',
            placeholder: 'Masukkan Nama Dokter',
            size: 'md:col-span-6',
            options: props.patients,
            handleChange: handleMedicalRecordChange
        },
        {
            label: 'Nama Pasien ',
            required: true,
            name: 'patient_name',
            type: 'text',
            placeholder: 'Masukkan Nama Pasien',
            size: 'md:col-span-6',
            disabled: true,
        },
        {
            label: 'Tanggal Lahir Pasien ',
            required: true,
            name: 'date_of_birth',
            type: 'date',
            size: 'md:col-span-6',
            disabled: true,
        },
        {
            label: 'Tanggal Pembuatan Formula Cairan',
            required: true,
            name: 'date_formula',
            type: 'date',
            size: 'md:col-span-6',
        },
        {
            label: 'Usia Aktual Pasien (Hari)',
            required: true,
            name: 'actual_age',
            type: 'number',
            size: 'md:col-span-6',
            disabled: true,
            defaultValue: actualAge
        },
        {
            label: 'Usia Gestasi (Minggu)',
            required: true,
            name: 'gestational_age',
            type: 'number',
            size: 'md:col-span-6',
        },
        {
            label: 'Tanggal Masuk Perawatan',
            required: true,
            name: 'date_of_treatment',
            type: 'date',
            size: 'md:col-span-6',
        },
        {
            label: 'Perawatan Hari Ke',
            required: true,
            name: 'day_care',
            type: 'number',
            size: 'md:col-span-6',
            defaultValue: dateOfTreatment,
            disabled: true,
        },
        {
            label: 'Berat Aktual Pasien (Kg)',
            required: true,
            name: 'actual_weight',
            type: 'number',
            size: 'md:col-span-6',
            placeholder: '0.00',
            max: 1000
        },
    ]

    const laboratoryFields: fieldInterface[] = [
        {
            label: 'Hb (g/dL)',
            name: 'hemoglobin',
            type: 'number',
            size: 'md:col-span-6',
            placeholder: '0.00',
            defaultValue: 0
        },
        {
            label: 'Na+ (mEq/L)',
            name: 'natrium',
            type: 'number',
            size: 'md:col-span-6',
            placeholder: '0.00',
            defaultValue: 0
        },
        {
            label: 'K+ (mEq/L)',
            name: 'kalium',
            type: 'number',
            size: 'md:col-span-6',
            placeholder: '0.00',
            defaultValue: 0
        },
        {
            label: 'Cl- (mEq/L)',
            name: 'chloride',
            type: 'number',
            size: 'md:col-span-6',
            placeholder: '0.00',
            defaultValue: 0
        },
        {
            label: 'Mg2+ (mmol/L)',
            name: 'magnesium',
            type: 'number',
            size: 'md:col-span-6',
            placeholder: '0.00',
            defaultValue: 0
        },
        {
            label: 'PO43- (mmol/L)',
            name: 'phosphate',
            type: 'number',
            size: 'md:col-span-6',
            placeholder: '0.00',
            defaultValue: 0
        },
        {
            label: 'Ca2+ ion (mmol/L)',
            name: 'calcium',
            type: 'number',
            size: 'md:col-span-6',
            placeholder: '0.00',
            defaultValue: 0
        },
        {
            label: 'Glukosa Darah Sewaktu (mg/dL)',
            name: 'glucose',
            type: 'number',
            size: 'md:col-span-6',
            placeholder: '0.00',
            defaultValue: 0
        },
        {
            label: 'Ureum Serum (mg/dL)',
            name: 'ureum',
            type: 'number',
            size: 'md:col-span-6',
            placeholder: '0.00',
            defaultValue: 0
        },
        {
            label: 'Creatinine Serum (mg/dL)',
            name: 'creatinine',
            type: 'number',
            size: 'md:col-span-6',
            placeholder: '0.00',
            defaultValue: 0
        }
    ]

    const environmentFields: fieldInterface[] = [
        {
            label: 'Menggunakan Infant Warmer',
            required: true,
            type: 'radio-option',
            name: 'infant_warmer',
        },
        {
            label: 'Sedang Fototerapi',
            required: true,
            type: 'radio-option',
            name: 'phototherapy',
        },
        {
            label: 'Humidity Incubator',
            required: true,
            type: 'radio-option',
            name: 'humidity_incubator',
        },
        {
            label: 'Bayi Dibungkus Plastik',
            required: true,
            type: 'radio-option',
            name: 'infant_wrapping',
        },
        {
            label: 'Suhu Terkini (Derajat Celcius)',
            type: 'number',
            required: true,
            placeholder: '°C',
            name: 'current_temperature',
        }
    ]

    const dailyFluidBalanceFields: fieldInterface[] = [
        {
            label: 'Waktu Penghitungan (dalam berapa jam terakhir)',
            required: true,
            type: 'number',
            placeholder: '0.00',
            name: 'time_calculation',
        },
        {
            label: 'Estimasi Insensible Water Loss (IWL) dalam 24 jam',
            required: true,
            type: 'number',
            placeholder: '0.00',
            name: 'insensible_water_loss',
            disabled: true,
            defaultValue: getInsensibleWaterLoss
        },
        {
            label: 'Input Cairan (Total) dalam waktu penghitungan terakhir*',
            name: 'input_fluid',
            required: true,
            type: 'number',
            placeholder: '0.00',
        },
        {
            label: 'Output Cairan (Total) dalam waktu penghitungan terakhir*',
            name: 'output_fluid',
            required: true,
            type: 'number',
            placeholder: '0.00',
        },
        {
            label: 'Balans Harian (mL/hari)',
            name: 'daily_balance',
            required: true,
            type: 'text',
            disabled: true,
            placeholder: '0.00',
        }
    ]

    const dialogTemuanLaboratorium = ref(false);

    onMounted(() => {
        patientFields.forEach((field) => {
            if(form[field.name] === undefined || form[field.name] == null){
                form[field.name] = field.defaultValue || '';
            }
        });

        if (props.methodCalculation != 'manual') {

            laboratoryFields.forEach((field) => {
                if(form[field.name] === undefined || form[field.name] == null){
                    form[field.name] = field.defaultValue || 0;
                }
            });

            environmentFields.forEach((field) => {
                console.log();

                if(form[field.name] === undefined || form[field.name] == null){
                    form[field.name] = field.defaultValue || 0;
                }
            })

            if (form['clinical_sensation'] === undefined || form['clinical_sensation'] == null) {
                form['clinical_sensation'] = '';
            }

            form['output_fluid'] = form['output_fluid'] == null ? 0 : form['output_fluid']
        }
    });
</script>
<template>
    <div class="grid w-full grid-cols-12 p-5 rounded-lg gap-7">
        <div :class="field.size" class="col-span-12" v-for="field in patientFields">
            <InputGroup :form="form" :label="field.label" :name="field.name" :type="field.type" :placeholder="field?.placeholder" :required="field.required" :disabled="field?.disabled" :defaultValue="field?.defaultValue"  :options="field?.options" :handleChange="field?.handleChange" :max="field.max" />
        </div>
    </div>
    <template v-if="props.methodCalculation != 'manual'">
        <div class="grid w-full grid-cols-12 p-5 mt-3 rounded-lg gap-7">
            <div class="col-span-6">
                <div class="mb-4 text-base font-bold md:text-xl">Current Condition</div>
                <InputGroup :className="'w-full space-x-6'" :form="form" label="Kesan Klinis" :name="'clinical_sensation'" type="radio-option"  :required="true"
                :options="[
                    {
                        label: 'Normohidrasi',
                        value: '0'
                    },
                    {
                        label: 'Dehidrasi',
                        value: '1'
                    },
                    {
                        label: 'Overload',
                        value: '2'
                    }
                ]"/>
            </div>
            <div class="col-span-6">
                <div class="mb-4 text-base font-bold md:text-xl ">Temuan Laboratorium</div>
                <Button type="button" @click="dialogTemuanLaboratorium = true" >Setup Temuan Laboratorium</Button>
            </div>
        </div>
        <div class="grid w-full grid-cols-12 p-5 mt-3 rounded-lg gap-7">
            <div class="col-span-6">
                <div class="mb-4 text-base font-bold md:text-xl">Kondisi Lingkungan Pasien</div>
                <div class="grid w-full grid-cols-12 p-5 rounded-lg gap-7">
                    <div  class="col-span-12" v-for="field in environmentFields">
                        <InputGroup :form="form" :className="'w-full space-x-6'" :label="field.label" :name="field.name" :type="field.type" :placeholder="field?.placeholder" :required="field.required" :disabled="field?.disabled" :defaultValue="field?.defaultValue"  :handleChange="field?.handleChange"
                            :options="field.type === 'radio-option' ? [
                                {
                                    label: 'Ya',
                                    value: 1
                                },
                                {
                                    label: 'Tidak',
                                    value: 0
                                }
                            ] : []"
                        />
                    </div>
                </div>
            </div>
            <div class="col-span-6">
                <div class="mb-4 text-base font-bold md:text-xl">Balans Cairan Harian</div>
                <div class="grid w-full grid-cols-12 p-5 rounded-lg gap-7">
                    <div :size="field.size" class="flex justify-between w-full col-span-12" v-for="(field, fi) in dailyFluidBalanceFields">
                        <InputGroup :form="form" :rootClassName="fi > 0 ? 'w-[70%]' : 'w-full'" :label="field.label" :name="field.name" :type="field.type" :placeholder="field?.placeholder" :required="field.required" :disabled="field?.disabled" :defaultValue="field?.defaultValue"  :handleChange="field?.handleChange"

                        />
                        <InputGroup v-if="fi != 0" :form="form" :rootClassName="'w-[28%]'" :label="'mL/kg'" :name="field.name+'_volume'" :type="field.type" :placeholder="'0.00'" :required="field.required" :disabled="true" :defaultValue="getDailyBalansVolume(field.name)"

                        />
                    </div>
                </div>
            </div>
        </div>

        <Dialog v-model:open="dialogTemuanLaboratorium" @close="dialogTemuanLaboratorium = false">
            <DialogContent class="sm:max-w-[425px] md:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Temuan Laboratorium</DialogTitle>
                </DialogHeader>
                <div>
                    <div class="grid w-full grid-cols-12 p-5 rounded-lg gap-7">
                        <div :class="field.size" class="col-span-12" v-for="field in laboratoryFields">
                            <InputGroup :min="0" :form="form" :label="field.label" :name="field.name" :type="field.type" :placeholder="field?.placeholder" :required="field.required" :disabled="field?.disabled" :defaultValue="field?.defaultValue"  :options="field?.options" :handleChange="field?.handleChange" />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button"  @click="dialogTemuanLaboratorium = false;">
                        Simpan
                    </Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    </template>
</template>
