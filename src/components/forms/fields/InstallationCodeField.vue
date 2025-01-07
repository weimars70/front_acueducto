<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { installationService } from '../../../services/api/installation.service';

const emit = defineEmits<{
  (e: 'installation-found', data: any): void;
}>();

const $q = useQuasar();
const codigo = ref('');

const handleKeyPress = async (event: KeyboardEvent) => {
  if (event.key === 'Enter' && codigo.value) {
    try {
      const installation = await installationService.getByCode(Number(codigo.value));
      emit('installation-found', installation);
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.message
      });
    }
  }
};

const clear = () => {
  codigo.value = '';
};

defineExpose({
  clear,
  focus: () => {
    const input = document.querySelector('input[aria-label="Código"]');
    if (input) {
      input.focus();
    }
  }
});
</script>

<template>
  <q-input
    v-model="codigo"
    label="Código"
    outlined
    dense
    :rules="[val => !!val || 'Campo requerido']"
    @keypress="handleKeyPress"
  />
</template>