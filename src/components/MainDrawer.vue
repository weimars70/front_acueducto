<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useTabsStore } from '../stores/tabs';

const props = defineProps<{
  modelValue: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>();

const router = useRouter();
const authStore = useAuthStore();
const tabsStore = useTabsStore();
const miniState = ref(false);

const menuItems = [
  {
    icon: 'dashboard',
    label: 'Dashboard',
    route: '/dashboard',
    closable: false,
  },
  {
    icon: 'show_chart',
    label: 'Consumos',
    route: '/consumptions',
    closable: true,
  },
  {
    icon: 'people',
    label: 'Usuarios',
    route: '/users',
    closable: true,
  },
  {
    icon: 'settings',
    label: 'Configuración',
    route: '/settings',
    closable: true,
  },
];

const navigateTo = (item: typeof menuItems[0]) => {
  tabsStore.addTab({
    name: item.label,
    route: item.route,
    icon: item.icon,
    closable: item.closable,
  });
  router.push(item.route);
  emit('update:modelValue', false); // Close drawer on mobile after navigation
};

const toggleMiniState = () => {
  miniState.value = !miniState.value;
};
</script>

<template>
  <q-drawer
    :model-value="modelValue"
    :mini="miniState"
    :width="240"
    :breakpoint="500"
    bordered
    class="bg-white"
    show-if-above
    @update:model-value="emit('update:modelValue', $event)"
  >
    <!-- Header -->
    <q-toolbar class="bg-primary text-white">
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
      </q-avatar>
      <q-toolbar-title class="text-weight-bold">
        Menu
      </q-toolbar-title>
      <q-btn
        flat
        round
        dense
        icon="chevron_left"
        @click="toggleMiniState"
        :rotate="miniState ? 180 : 0"
      />
    </q-toolbar>

    <!-- User Info -->
    <q-list padding>
      <q-item v-if="authStore.user">
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            {{ authStore.user.name.charAt(0).toUpperCase() }}
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ authStore.user.name }}</q-item-label>
          <q-item-label caption>{{ authStore.user.email }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <!-- Menu Items -->
      <q-item
        v-for="item in menuItems"
        :key="item.route"
        clickable
        v-ripple
        :active="router.currentRoute.value.path === item.route"
        active-class="text-primary"
        @click="navigateTo(item)"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" />
        </q-item-section>
        <q-item-section>
          {{ item.label }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<style lang="scss" scoped>
.q-drawer {
  .q-toolbar {
    height: 64px;
  }
  
  .q-item {
    border-radius: 8px;
    margin: 0 8px;
    
    &.q-item--active {
      background: rgba(25, 118, 210, 0.1);
    }
  }
}
</style>