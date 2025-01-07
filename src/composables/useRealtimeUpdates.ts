import { onMounted, onUnmounted } from 'vue';
import { realtimeService } from '../services/supabase/realtime';

export function useRealtimeUpdates(onUpdate: () => void) {
  let unsubscribe: (() => void) | null = null;

  onMounted(() => {
    unsubscribe = realtimeService.subscribeToConsumptions(onUpdate);
  });

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
}