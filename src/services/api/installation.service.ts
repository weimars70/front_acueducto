import { apiClient } from './client';
import type { Installation } from '../../types/installation';

export const installationService = {
  async getByCode(code: number): Promise<Installation> {
    try {
      const { data } = await apiClient.get<Installation>(`/instalaciones`, {
        params: { codigo: code }
      });
      return data;
    } catch (error) {
      throw new Error('Código de instalación no válido');
    }
  },
};