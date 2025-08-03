import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'La contraseña actual es obligatoria' })
  @IsString({ message: 'La contraseña actual debe ser texto' })
  contrasenaActual: string;

  @IsNotEmpty({ message: 'La nueva contraseña es obligatoria' })
  @IsString({ message: 'La nueva contraseña debe ser texto' })
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' })
  contrasenaNueva: string;

  @IsNotEmpty({ message: 'La confirmación de contraseña es obligatoria' })
  @IsString({ message: 'La confirmación debe ser texto' })
  @MinLength(6, { message: 'La confirmación debe tener al menos 6 caracteres' })
  confirmarContrasena: string;
} 