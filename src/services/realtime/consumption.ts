import { supabase } from '../../config/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export class ConsumptionRealtimeService {
  private channel: RealtimeChannel | null = null;

  subscribe(onUpdate: () => void): () => void {
    if (this.channel) {
      this.channel.unsubscribe();
    }

    this.channel = supabase
      .channel('consumption_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'consumo'
        },
        (payload) => {
          console.log('Consumption change detected:', payload);
          onUpdate();
        }
      )
      .subscribe();

    return () => this.unsubscribe();
  }

  private unsubscribe(): void {
    if (this.channel) {
      this.channel.unsubscribe();
      this.channel = null;
    }
  }
}

export const consumptionRealtimeService = new ConsumptionRealtimeService();