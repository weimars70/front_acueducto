<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import InstallationCodeField from './fields/InstallationCodeField.vue';
import ReadonlyField from './fields/ReadonlyField.vue';
import DateFields from './fields/DateFields.vue';
import { getCurrentDate, getCurrentMonth, getCurrentYear, months } from '../../utils/dates';
import { useConsumptionForm } from '../../composables/useConsumptionForm';

const $q = useQuasar();
const router = useRouter();
const codigoRef = ref(null);
const lecturaActualRef = ref(null);
const otrosCobrosRef = ref(null);
const reconexionRef = ref(null);
const { formData, updateConsumo, saveConsumption } = useConsumptionForm();

// Initialize default values
formData.value.mes = months[getCurrentMonth() - 1].text;
formData.value.year = getCurrentYear();
formData.value.fecha = getCurrentDate();

// Watch for changes in lectura_actual
watch(() => formData.value.lectura_actual, (newValue) => {
  if (newValue && formData.value.lectura_anterior) {
    updateConsumo(newValue);
  }
});

const handleLecturaActualKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    const consumo = parseFloat(formData.value.consumo);
    if (consumo > -1) {
      otrosCobrosRef.value?.focus();
    } else {
      lecturaActualRef.value?.focus();
      $q.notify({
        type: 'negative',
        message: 'El consumo debe ser mayor a -1'
      });
    }
  }
};

const handleOtrosCobrosKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && formData.value.otros_cobros !== null) {
    reconexionRef.value?.focus();
  }
};

const onInstallationFound = async (installation: any) => {
  formData.value = {
    ...formData.value,
    codigo: installation.codigo.toString(),
    medidor: installation.codigo_medidor,
    cliente: installation.nombre,
    sector: installation.sector_nombre,
    direccion: installation.direccion,
    lectura_anterior: installation.lectura_anterior.toString(),
    promedio: installation.promedio
  };
  
  await nextTick();
  lecturaActualRef.value?.focus();
};

const onCancel = () => {
  router.push('/consumptions');
};

const handleSave = async () => {
  const success = await saveConsumption();
  if (success) {
    codigoRef.value?.clear();
    await nextTick();
    codigoRef.value?.focus();
  }
};
</script>

<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Fecha, Mes y Año -->
      <div class="col-12">
        <DateFields v-model="formData" />
      </div>

      <!-- Código de Instalación -->
      <div class="col-12 col-md-2">
        <InstallationCodeField 
          ref="codigoRef"
          @installation-found="onInstallationFound" 
        />
      </div>

      <!-- Cliente -->
      <div class="col-12 col-md-4">
        <ReadonlyField
          v-model="formData.cliente"
          label="Cliente"
        />
      </div>

      <!-- Sector -->
      <div class="col-12 col-md-3">
        <ReadonlyField
          v-model="formData.sector"
          label="Sector"
        />
      </div>

      <!-- Medidor -->
      <div class="col-12 col-md-3">
        <ReadonlyField
          v-model="formData.medidor"
          label="Medidor"
        />
      </div>

      <!-- Dirección -->
      <div class="col-12">
        <ReadonlyField
          v-model="formData.direccion"
          label="Dirección"
        />
      </div>

      <!-- Lecturas y Consumo -->
      <div class="col-12 col-md-3">
        <ReadonlyField
          v-model="formData.lectura_anterior"
          label="Lectura Anterior"
          type="number"
        />
      </div>

      <div class="col-12 col-md-3">
        <q-input
          ref="lecturaActualRef"
          v-model="formData.lectura_actual"
          label="Lectura Actual"
          type="number"
          outlined
          dense
          @keyup="handleLecturaActualKeyup"
        />
      </div>

      <div class="col-12 col-md-3">
        <ReadonlyField
          v-model="formData.consumo"
          label="Consumo"
          type="number"
        />
      </div>

      <div class="col-12 col-md-3">
        <ReadonlyField
          v-model="formData.promedio"
          label="Promedio"
          type="number"
        />
      </div>

      <!-- Cobros Adicionales -->
      <div class="col-12 col-md-4">
        <q-input
          ref="otrosCobrosRef"
          v-model="formData.otros_cobros"
          label="Otros Cobros"
          type="number"
          outlined
          dense
          @keyup="handleOtrosCobrosKeyup"
        />
      </div>

      <div class="col-12 col-md-4">
        <q-input
          ref="reconexionRef"
          v-model="formData.reconexion"
          label="Reconexión"
          type="number"
          outlined
          dense
        />
      </div>

      <!-- Botones -->
      <div class="col-12 row justify-end q-gutter-sm">
        <q-btn
          label="Cancelar"
          color="negative"
          flat
          @click="onCancel"
        />
        <q-btn
          label="Guardar"
          color="primary"
          @click="handleSave"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.q-form {
  max-width: 1200px;
  margin: 0 auto;
}
</style>