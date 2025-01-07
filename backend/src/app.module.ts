import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { ConsumoModule } from './consumo/consumo.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InstalacionesModule } from './instalaciones/instalaciones.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    ConsumoModule,
    AuthModule,
    UsersModule,
    InstalacionesModule,
  ],
})
export class AppModule {}