import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL or Key is missing.');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async testConnection() {
    try {
      // Intenta hacer una consulta simple
      const { data, error } = await this.supabase
        .from('users')
        .select('count')
        .limit(1);

      if (error) throw error;
      
      return { connected: true, data };
    } catch (error) {
      throw new Error(`Connection test failed: ${error.message}`);
    }
  }

  async getAllFromTable(tableName: string) {
    const { data, error } = await this.supabase.from(tableName).select('*');
    if (error) {
      throw new Error(`Error fetching data from ${tableName}: ${error.message}`);
    }
    return data;
  }
}