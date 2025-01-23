import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ConsumoService } from './consumo.service';
import { CreateConsumoDto } from './dto/create-consumo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('consumo')
export class ConsumoController {
  constructor(private readonly consumoService: ConsumoService) {}

  @Get('view')
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query() filters: Record<string, any>,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;

    delete filters.page;
    delete filters.limit;

    return this.consumoService.findAll(pageNumber, pageSize, filters);
  }

  @Get('last-readings')
  async getLastReadings(
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const yearNum = year ? parseInt(year, 10) : new Date().getFullYear();
    const monthNum = month ? parseInt(month, 10) : new Date().getMonth() + 1;
    return this.consumoService.getLastReadings(yearNum, monthNum);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createConsumoDto: CreateConsumoDto, @Request() req) {
    return this.consumoService.create(createConsumoDto, req.user.userId);
  }
}