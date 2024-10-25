import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, Matches, IsEmpty } from 'class-validator';
import { IsEqual } from './custom-decorators'; // Asegúrate de crear este decorador
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {   

  @ApiProperty({
    description: 'Este es tu correo',
    example: 'meowth.coin@gmail.com',
  })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  email: string;

  @ApiProperty({
    description: 'Este debe ser un nombre',
    example: 'meowth',
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(80, { message: 'El nombre no puede exceder los 80 caracteres.' })
  name: string;

  @ApiProperty({
    description: 'La contraseña puede ser de la siguiente manera',
    example: 'Coin12378!',
  })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(15, { message: 'La contraseña no puede exceder los 15 caracteres.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/, { 
    message: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.' 
  })
  password: string;

  @ApiProperty({
    description: 'Esta debe ser igual a la introducida en Password',
    example: 'Coin12378!',
  })
  @IsNotEmpty({ message: 'Confirmar contraseña es obligatorio.' })
  @IsString({ message: 'La confirmación de contraseña debe ser una cadena de texto.' })
  @IsEqual('password', { message: 'Las contraseñas no coinciden.' }) // Validación de coincidencia
  confirmPassword: string;

  @ApiProperty({
    description: 'Esta es igual a tu dirección de residencia',
    example: '10 Leaf Street',
  })
  @IsNotEmpty({ message: 'La dirección es obligatoria.' })
  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  @MinLength(3, { message: 'La dirección debe tener al menos 3 caracteres.' })
  @MaxLength(80, { message: 'La dirección no puede exceder los 80 caracteres.' })
  address: string;

  @ApiProperty({
    description: 'El teléfono puede ser de la siguiente manera',
    example: '+1234567896',
  })
  @IsNotEmpty({ message: 'El número de teléfono es obligatorio.' })
  @IsString({ message: 'El número de teléfono debe ser una cadena de texto.' })
  @Matches(/^\+?[0-9\s-]+$/, { message: 'El número de teléfono no es válido. Asegúrate de usar solo números, espacios y guiones.' })
  phone: string;

  @ApiProperty({
    description: 'Esta es igual a tu país de residencia',
    example: 'Colombia',
  })
  @IsNotEmpty({ message: 'El país es obligatorio.' })
  @IsString({ message: 'El país debe ser una cadena de texto.' })
  @MinLength(4, { message: 'El país debe tener al menos 4 caracteres.' })
  @MaxLength(20, { message: 'El país no puede exceder los 20 caracteres.' })
  country: string;

  @ApiProperty({
    description: 'Esta es igual a la ciudad de tu residencia',
    example: 'Bogotá D.C.',
  })  
  @IsNotEmpty({ message: 'La ciudad es obligatoria.' })
  @IsString({ message: 'La ciudad debe ser una cadena de texto.' })
  @MinLength(2, { message: 'La ciudad debe tener al menos 2 caracteres.' })
  @MaxLength(20, { message: 'La ciudad no puede exceder los 20 caracteres.' })
  city: string;

  @ApiHideProperty()
  @IsEmpty()
  isAdmin?: boolean;
}
