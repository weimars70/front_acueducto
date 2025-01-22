import { Network } from '@capacitor/network';
import { sqliteService } from '../database/sqlite.service';
import { consumptionService } from '../api/consumption.service';

export class SyncService {
  private networkStatus: { connected: boolean } | null = null;

  constructor() {
    this.initializeNetworkListeners();
  }

  private async initializeNetworkListeners(): Promise<void> {
    try {
      this.networkStatus = await Network.getStatus();

      Network.addListener('networkStatusChange', status => {
        this.networkStatus = status;
        if (status.connected) {
          this.syncPendingData();
        }
      });
    } catch (error) {
      console.error('Error initializing network listeners:', error);
      // Set a default status if network plugin fails
      this.networkStatus = { connected: true };
    }
  }

  async syncPendingData(): Promise<void> {
    if (!this.networkStatus?.connected) return;

    try {
      const pendingConsumptions = await sqliteService.getPendingSyncConsumptions();

      for (const consumption of pendingConsumptions) {
        try {
          await consumptionService.create(consumption);
          await sqliteService.markConsumptionAsSynced(consumption.id);
        } catch (error) {
          console.error('Error syncing consumption:', error);
        }
      }
    } catch (error) {
      console.error('Error in sync process:', error);
    }
  }

  async syncViews(): Promise<void> {
    if (!this.networkStatus?.connected) return;

    try {
      // Obtener el mes y año anterior
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      // Sincronizar view_instalaciones
      const installations = await consumptionService.getInstallations();
      await sqliteService.saveViewInstalaciones(installations);

      // Sincronizar view_consumo del mes anterior
      const consumptions = await consumptionService.getConsumptions({
        year,
        mes_codigo: month
      });
      await sqliteService.saveViewConsumo(consumptions.data);

    } catch (error) {
      console.error('Error syncing views:', error);
      throw error;
    }
  }

  isOnline(): boolean {
    return this.networkStatus?.connected || false;
  }
}

export const syncService = new SyncService();