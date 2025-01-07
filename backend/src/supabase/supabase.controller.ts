import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Controller('supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('test-connection')
  async testConnection() {
    try {
      const result = await this.supabaseService.testConnection();
      return { status: 'success', message: 'Connected to Supabase', data: result };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}