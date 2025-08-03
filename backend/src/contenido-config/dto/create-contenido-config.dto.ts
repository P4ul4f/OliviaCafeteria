import { IsString, IsObject, IsOptional } from 'class-validator';

export class CreateContenidoConfigDto {
  @IsString()
  clave: string;

  @IsObject()
  contenido: any;

  @IsOptional()
  @IsString()
  descripcion?: string;
}

export class UpdateContenidoConfigDto {
  @IsOptional()
  @IsObject()
  contenido?: any;

  @IsOptional()
  @IsString()
  descripcion?: string;
} 