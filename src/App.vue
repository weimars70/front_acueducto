<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import { sqliteService } from './services/database/sqlite.service';
import { syncService } from './services/sync/sync.service';

const authStore = useAuthStore();

onMounted(async () => {
  authStore.initializeAuth();
  await sqliteService.initialize();
  if (syncService.isOnline()) {
    await syncService.syncViews();
  }
});
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>