import { onMounted, onUnmounted } from 'vue';
import { consumptionRealtimeService } from '../services/realtime/consumption';

export function useConsumptionRealtime(onUpdate: () => void) {
  let cleanup: (() => void) | null = null;

  onMounted(() => {
    cleanup = consumptionRealtimeService.subscribe(onUpdate);
  });

  onUnmounted(() => {
    if (cleanup) {
      cleanup();
    }
  });
}