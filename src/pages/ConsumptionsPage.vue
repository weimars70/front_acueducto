<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { consumptionService } from '../services/api';
import { exportToExcel } from '../utils/export';
import { useScreenSize } from '../composables/useScreenSize';
import { useConsumptionRealtime } from '../composables/useConsumptionRealtime';
import ViewToggle from '../components/ViewToggle.vue';
import ConsumptionGrid from '../components/ConsumptionGrid.vue';
import ConsumptionTable from '../components/table/ConsumptionTable.vue';
import ConsumptionFilters from '../components/filters/ConsumptionFilters.vue';
import type { Consumption } from '../types/consumption';

const $q = useQuasar();
const router = useRouter();
const { isMobile } = useScreenSize();
const view = ref<'grid' | 'list'>(isMobile.value ? 'list' : 'grid');
const consumptions = ref<Consumption[]>([]);
const loading = ref(true);
const currentFilters = ref({});
const pagination = ref({
  sortBy: 'codigo',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

watch(isMobile, (newValue) => {
  view.value = newValue ? 'list' : 'grid';
});

const loadData = async () => {
  try {
    loading.value = true;
    const response = await consumptionService.getConsumptions({
      ...currentFilters.value,
      page: pagination.value.page,
      limit: pagination.value.rowsPerPage
    });
    
    consumptions.value = response.data;
    pagination.value.rowsNumber = response.total;
  } catch (error) {
    console.error('Error al cargar datos:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar los datos'
    });
  } finally {
    loading.value = false;
  }
};

useConsumptionRealtime(() => {
  $q.notify({
    type: 'info',
    message: 'Nuevos datos disponibles. Actualizando...',
    position: 'top',
    timeout: 2000
  });
  loadData();
});

const handleExport = () => {
  try {
    exportToExcel(consumptions.value);
    $q.notify({
      type: 'positive',
      message: 'Exportación exitosa'
    });
  } catch (error) {
    console.error('Error en exportación:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al exportar'
    });
  }
};

const handleNewRecord = () => {
  router.push('/consumptions/new');
};

const handleFilter = async (filters: any) => {
  currentFilters.value = filters;
  pagination.value.page = 1;
  await loadData();
};

const onRequest = async (props: any) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  pagination.value = { ...pagination.value, page, rowsPerPage, sortBy, descending };
  await loadData();
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <q-page padding>
    <div class="consumption-page q-pa-md">
      <div class="page-header q-mb-md">
        <div class="row items-center no-wrap">
          <div class="col">
            <ConsumptionFilters @filter="handleFilter" />
          </div>
          <div class="col-auto actions-wrapper q-ml-sm">
            <div class="row items-center no-wrap q-gutter-x-xs">
              <ViewToggle v-model="view" />
              <q-btn
                color="primary"
                :icon-right="isMobile ? undefined : 'download'"
                :icon="isMobile ? 'download' : undefined"
                :label="isMobile ? undefined : 'Exportar'"
                dense
                @click="handleExport"
              />
              <q-btn
                color="primary"
                :icon-right="isMobile ? undefined : 'add'"
                :icon="isMobile ? 'add' : undefined"
                :label="isMobile ? undefined : 'Nuevo'"
                dense
                @click="handleNewRecord"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="content-section">
        <template v-if="view === 'list' && !isMobile">
          <ConsumptionTable
            :rows="consumptions"
            :loading="loading"
            :pagination="pagination"
            @request="onRequest"
          />
        </template>
        <template v-else>
          <ConsumptionGrid :items="consumptions" />
        </template>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.consumption-page {
  .page-header .row {
    flex-wrap: nowrap;
  }

  .actions-wrapper {
    white-space: nowrap;
  }

  .q-btn {
    min-width: unset;
  }

  @media (max-width: 599px) {
    .page-header .row {
      flex-wrap: wrap;
      row-gap: 8px;
      
      .col {
        width: 100%;
      }
      
      .actions-wrapper {
        width: 100%;
        justify-content: flex-end;
        display: flex;
      }
    }
  }
}
</style>