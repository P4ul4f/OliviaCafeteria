import { IsString, IsNumber, IsEmail, IsOptional, Min } from 'class-validator';

export class CreateGiftCardDto {
  @IsString()
  nombreComprador: string;

  @IsString()
  telefonoComprador: string;

  @IsEmail()
  emailComprador: string;

  @IsString()
  nombreDestinatario: string;

  @IsString()
  telefonoDestinatario: string;

  @IsNumber()
  @Min(1)
  monto: number;

  @IsOptional()
  @IsString()
  mensaje?: string;
}

export class CreateGiftCardConPagoDto extends CreateGiftCardDto {
  idPagoExterno?: string;
  metodoPago?: string;
} 