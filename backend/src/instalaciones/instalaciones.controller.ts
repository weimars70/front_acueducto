import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { InstalacionesService } from './instalaciones.service';
import { GetInstalacionDto } from './dto/get-instalacion.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('instalaciones')
@Controller('instalaciones')
export class InstalacionesController {
  constructor(private readonly instalacionesService: InstalacionesService) {}

  @Get()
  @ApiOperation({ summary: 'Get installation by code' })
  @ApiResponse({ status: 200, description: 'Installation found successfully' })
  @ApiResponse({ status: 404, description: 'Installation not found' })
  async getInstalacion(@Query() getInstalacionDto: GetInstalacionDto) {
    try {
      return await this.instalacionesService.findOne(getInstalacionDto.codigo);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error retrieving installation: ${error.message}`);
    }
  }
}