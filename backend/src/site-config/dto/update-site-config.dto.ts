import { IsOptional, IsString, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class HorarioDto {
  @IsOptional()
  abierto?: boolean;

  @IsOptional()
  @IsString()
  manana?: string;

  @IsOptional()
  @IsString()
  noche?: string;
}

class HorariosDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => HorarioDto)
  lunes?: HorarioDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => HorarioDto)
  martes?: HorarioDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => HorarioDto)
  miercoles?: HorarioDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => HorarioDto)
  jueves?: HorarioDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => HorarioDto)
  viernes?: HorarioDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => HorarioDto)
  sabado?: HorarioDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => HorarioDto)
  domingo?: HorarioDto;
}

export class UpdateSiteConfigDto {
  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => HorariosDto)
  horarios?: HorariosDto;
} 