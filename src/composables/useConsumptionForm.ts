import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { consumptionService } from '../services/api/consumption.service';
import { months } from '../utils/dates';

export function useConsumptionForm() {
  const $q = useQuasar();
  const router = useRouter();
  const authStore = useAuthStore();
  
  const initialFormState = {
    codigo: '',
    mes: '',
    year: '',
    fecha: '',
    medidor: '',
    cliente: '',
    sector: '',
    direccion: '',
    lectura_anterior: '',
    lectura_actual: '',
    consumo: '0',
    promedio: '0',
    otros_cobros: '0',
    reconexion: '0'
  };
  
  const formData = ref({ ...initialFormState });

  const resetForm = () => {
    // Preserve mes, year, and fecha
    const { mes, year, fecha } = formData.value;
    formData.value = {
      ...initialFormState,
      mes,
      year,
      fecha
    };
  };

  const isValid = computed(() => {
    return formData.value.lectura_actual !== '' && 
           formData.value.lectura_anterior !== '' &&
           formData.value.codigo !== '';
  });

  const validateLecturaActual = (actual: number, anterior: number): boolean => {
    if (actual < anterior) {
      return false;
    }

    const consumo = actual - anterior;
    if (consumo < 0) {
      $q.notify({
        type: 'negative',
        message: 'El consumo no puede ser menor a 0'
      });
      return false;
    }

    return true;
  };

  const updateConsumo = (lecturaActual: string) => {
    const actual = parseFloat(lecturaActual);
    const anterior = parseFloat(formData.value.lectura_anterior);
    
    if (!validateLecturaActual(actual, anterior)) {
      formData.value.lectura_actual = '';
      formData.value.consumo = '0';
      return;
    }
    
    formData.value.consumo = (actual - anterior).toString();
  };

  const saveConsumption = async () => {
    if (!isValid.value) {
      $q.notify({
        type: 'negative',
        message: 'Por favor complete todos los campos requeridos'
      });
      return;
    }

    try {
      const monthObj = months.find(m => m.text === formData.value.mes);
      if (!monthObj) {
        throw new Error('Mes inválido');
      }

      const consumptionData = {
        instalacion: parseInt(formData.value.codigo),
        lectura: parseFloat(formData.value.lectura_actual),
        fecha: formData.value.fecha,
        consumo: parseFloat(formData.value.consumo),
        mes: monthObj.value,
        year: parseInt(formData.value.year),
        medidor: formData.value.medidor,
        otros_cobros: parseFloat(formData.value.otros_cobros),
        reconexion: parseFloat(formData.value.reconexion),
        usuario: authStore.user?.name || ''
      };

      await consumptionService.create(consumptionData);
      
      $q.notify({
        type: 'positive',
        message: 'Consumo registrado exitosamente'
      });
      
      resetForm();
      return true;
    } catch (error) {
      console.error('Error saving consumption:', error);
      $q.notify({
        type: 'negative',
        message: error instanceof Error ? error.message : 'Error al guardar el consumo'
      });
      return false;
    }
  };

  return {
    formData,
    updateConsumo,
    saveConsumption,
    resetForm,
    isValid
  };
}