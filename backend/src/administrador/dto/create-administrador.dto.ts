import { IsNotEmpty, IsString, Length, IsStrongPassword } from 'class-validator';

export class CreateAdministradorDto {
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  @IsString({ message: 'El usuario debe ser texto' })
  @Length(3, 50, { message: 'El usuario debe tener entre 3 y 50 caracteres' })
  usuario: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser texto' })
  @Length(8, 128, { message: 'La contraseña debe tener entre 8 y 128 caracteres' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message: 'La contraseña debe tener al menos 8 caracteres, una minúscula, una mayúscula y un número',
    }
  )
  contrasena: string;
} 