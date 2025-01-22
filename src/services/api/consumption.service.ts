import { apiClient } from './client';
import type { Consumption } from '../../types/consumption';
import type { PaginatedResponse } from '../../types/api';
import type { Installation } from '../../types/installation';

export const consumptionService = {
  async getConsumptions(params: {
    year?: number | null;
    mes_codigo?: number | null;
    nombre?: string;
    instalacion?: number | null;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Consumption>> {
    try {
      const { page, limit, ...filters } = params;
      const queryParams = new URLSearchParams();
      
      if (page !== undefined) {
        queryParams.append('page', page.toString());
      }
      
      if (limit !== undefined) {
        queryParams.append('limit', limit.toString());
      }
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const { data } = await apiClient.get<PaginatedResponse<Consumption>>('/consumo/view', { 
        params: queryParams
      });

      return data;
    } catch (error) {
      console.error('Error en getConsumptions:', error);
      throw error;
    }
  },

  async create(consumption: Partial<Consumption>) {
    const { data } = await apiClient.post('/consumo', consumption);
    return data;
  },

  async getInstallations(): Promise<Installation[]> {
    try {
      const { data } = await apiClient.get<Installation[]>('/instalaciones/all');
      return data;
    } catch (error) {
      console.error('Error getting installations:', error);
      throw error;
    }
  }
};