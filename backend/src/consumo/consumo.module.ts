import { Module } from '@nestjs/common';
import { ConsumoService } from './consumo.service';
import { ConsumoController } from './consumo.controller';

@Module({
  controllers: [ConsumoController],
  providers: [ConsumoService],
})
export class ConsumoModule {}
