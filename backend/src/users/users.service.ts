import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UsersService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async findOne(username: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('login', username)
      .single();

    if (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
    return data;
  }
}