<script setup lang="ts">
import type { Consumption } from '../types/consumption';

defineProps<{
  items: Consumption[]
}>();

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ'
  }).format(value);
};
</script>

<template>
  <div class="row q-col-gutter-sm">
    <div v-for="item in items" :key="item.codigo" class="col-12 col-sm-6 col-md-4">
      <q-card class="consumption-card">
        <!-- Encabezado -->
        <q-card-section class="bg-primary text-white q-pa-sm">
          <div class="text-subtitle1">{{ item.nombre }}</div>
        </q-card-section>

        <!-- Información principal -->
        <q-card-section class="q-pa-sm">
          <div class="row q-col-gutter-sm">
            <!-- Detalles de Instalación -->
            <div class="col-12">
              <div class="text-subtitle2 text-grey-8">Detalles de Instalación</div>
              <div class="row q-col-gutter-x-md q-mt-xs">
                <div class="col-6">
                  <div class="flex items-center">
                    <q-icon name="home" color="primary" size="sm" class="q-mr-xs" />
                    <span class="text-body2">Instalación: {{ item.instalacion }}</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="flex items-center">
                    <q-icon name="speed" color="secondary" size="sm" class="q-mr-xs" />
                    <span class="text-body2">Medidor: {{ item.medidor }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Lecturas -->
            <div class="col-12 q-mt-sm">
              <div class="text-subtitle2 text-grey-8">Lecturas</div>
              <div class="row q-col-gutter-sm q-mt-xs">
                <div class="col-6">
                  <q-card flat bordered class="text-center bg-blue-1">
                    <q-card-section class="q-pa-xs">
                      <div class="text-caption">Lectura</div>
                      <div class="text-h6 text-primary">{{ item.lectura }}</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-6">
                  <q-card flat bordered class="text-center bg-green-1">
                    <q-card-section class="q-pa-xs">
                      <div class="text-caption">Consumo</div>
                      <div class="text-h6 text-positive">{{ item.consumo }}</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>

            <!-- Período -->
            <div class="col-12 q-mt-sm">
              <div class="text-subtitle2 text-grey-8">Período</div>
              <div class="row items-center q-gutter-x-sm q-mt-xs">
                <q-chip dense size="sm" icon="event" color="grey-7" text-color="white">
                  {{ item.mes }} {{ item.year }}
                </q-chip>
                <q-chip 
                  dense
                  size="sm"
                  :icon="item.facturado ? 'check_circle' : 'pending'"
                  :color="item.facturado ? 'positive' : 'warning'"
                  text-color="white"
                >
                  {{ item.facturado ? 'Facturado' : 'Pendiente' }}
                </q-chip>
              </div>
            </div>

            <!-- Cobros Adicionales -->
            <template v-if="item.otros_cobros || item.reconexion">
              <div class="col-12 q-mt-sm">
                <div class="text-subtitle2 text-grey-8">Cobros Adicionales</div>
                <div class="row q-col-gutter-x-md q-mt-xs">
                  <div v-if="item.otros_cobros" class="col-6">
                    <div class="text-body2">
                      <div>Otros Cobros</div>
                      <div class="text-caption">{{ formatCurrency(item.otros_cobros) }}</div>
                    </div>
                  </div>
                  <div v-if="item.reconexion" class="col-6">
                    <div class="text-body2">
                      <div>Reconexión</div>
                      <div class="text-caption">{{ formatCurrency(item.reconexion) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consumption-card {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 6px 0 rgba(0,0,0,.1);
  }
}
</style>