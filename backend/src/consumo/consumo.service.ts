import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateConsumoDto } from './dto/create-consumo.dto';

@Injectable()
export class ConsumoService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async findAll(page: number, limit: number, filters: Record<string, any>) {
    try {
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      let query = this.supabase
        .from('view_consumo')
        .select('*', { count: 'exact' })
        .range(start, end)
        .order('codigo', { ascending: false });
     
      if (Object.keys(filters).length > 0) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            if (key === 'nombre') {
              query = query.ilike(key, `%${value}%`);
            } else if (key.endsWith('_gte')) {
              query = query.gte(key.replace('_gte', ''), value);
            } else if (key.endsWith('_lte')) {
              query = query.lte(key.replace('_lte', ''), value);
            } else if (Array.isArray(value)) {
              query = query.in(key, value);
            } else {
              query = query.eq(key, value);
            }
          }
        });
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Error fetching data: ${error.message}`);
      }

      return {
        data,
        total: count,
        page,
        limit,
      };
    } catch (err) {
      console.error('Supabase Query Error:', err);
      throw new Error(`Error fetching data: ${err.message}`);
    }
  }

  async getLastReadings(year: number, month: number) {
    try {
      const { data: allReadings, error: readingsError } = await this.supabase
        .from('view_consumo')
        .select('*')
        .eq('year', year)
        .eq('mes_codigo', month)
        .order('fecha', { ascending: false })
        .order('codigo', { ascending: false });

      if (readingsError) {
        throw new Error(`Error fetching readings: ${readingsError.message}`);
      }

      // Create a map to store the latest reading for each installation
      const latestReadings = new Map();

      // Get only the latest reading for each installation
      allReadings.forEach(reading => {
        if (!latestReadings.has(reading.instalacion)) {
          latestReadings.set(reading.instalacion, reading);
        }
      });

      // Convert the map values to an array and sort by installation
      return Array.from(latestReadings.values())
        .sort((a, b) => a.instalacion - b.instalacion);

    } catch (error) {
      console.error('Error getting last readings:', error);
      throw new Error(`Error getting last readings: ${error.message}`);
    }
  }

  async create(createConsumoDto: CreateConsumoDto, userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('consumo')
        .insert({
          ...createConsumoDto,
          usuario: userId,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating consumption: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating consumption:', error);
      throw new Error(`Error creating consumption: ${error.message}`);
    }
  }
}