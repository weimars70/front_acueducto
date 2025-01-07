import axios from 'axios';
import type { Consumption } from '../types/consumption';
import type { PaginatedResponse } from '../types/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

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
      
      // Construir objeto de parámetros base
      const queryParams = new URLSearchParams();
      
      // Agregar parámetros de paginación si están presentes
      if (page !== undefined) {
        queryParams.append('page', page.toString());
      }
      
      if (limit !== undefined) {
        queryParams.append('limit', limit.toString());
      }
      
      // Agregar filtros solo si tienen valores válidos
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      console.log('Parámetros enviados:', Object.fromEntries(queryParams));

      const { data } = await api.get<PaginatedResponse<Consumption>>('/consumo/view', { 
        params: queryParams
      });

      return data;
    } catch (error) {
      console.error('Error en getConsumptions:', error);
      throw error;
    }
  }
};