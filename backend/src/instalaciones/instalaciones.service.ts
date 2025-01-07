import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Instalacion } from './entities/instalacion.entity';

@Injectable()
export class InstalacionesService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async findOne(codigo: number): Promise<Instalacion> {
    try {
      const { data, error } = await this.supabase
        .from('view_instalaciones')
        .select(`
          codigo,
          codigo_medidor,
          nombre,
          sector_nombre,
          direccion,promedio,lectura_anterior
        `)
        .eq('codigo', codigo)
        .single();
    
      if (error) {
        throw new Error(`Error fetching installation: ${error.message}`);
      }

      if (!data) {
        throw new NotFoundException(`Installation with code ${codigo} not found`);
      }

      return data;
    } catch (err) {
      console.error('Supabase Query Error:', err);
      throw new Error(`Error fetching installation: ${err.message}`);
    }
  }
}