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