import { Module } from '@nestjs/common';
import { InstalacionesService } from './instalaciones.service';
import { InstalacionesController } from './instalaciones.controller';

@Module({
  controllers: [InstalacionesController],
  providers: [InstalacionesService],
  exports: [InstalacionesService],
})
export class InstalacionesModule {}