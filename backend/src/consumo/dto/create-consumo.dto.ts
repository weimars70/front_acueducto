import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateConsumoDto {
  @ApiProperty()
  @IsNumber()
  instalacion: number;

  @ApiProperty()
  @IsNumber()
  lectura: number;

  @ApiProperty()
  @IsDateString()
  fecha: string;

  @ApiProperty()
  @IsNumber()
  consumo: number;

  @ApiProperty()
  @IsString()
  mes: string;

  @ApiProperty()
  @IsNumber()
  year: number;

  @ApiProperty()
  @IsString()
  medidor: string;

  @ApiProperty()
  @IsNumber()
  otros_cobros: number;

  @ApiProperty()
  @IsNumber()
  reconexion: number;

  @ApiProperty()
  @IsString()
  usuario: string;
}