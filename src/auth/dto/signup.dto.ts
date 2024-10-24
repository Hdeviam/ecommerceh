import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  
  @ApiProperty({
    description: 'Este debe ser un nombre',
    example: 'meowth seilder',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'ejemplo@correo.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'mi_contraseña_segura',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Confirmación de la contraseña',
    example: 'mi_contraseña_segura',
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
