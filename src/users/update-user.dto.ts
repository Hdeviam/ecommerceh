import { IsString, IsEmail, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(80, { message: 'El nombre no puede exceder los 80 caracteres.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  @MinLength(3, { message: 'La dirección debe tener al menos 3 caracteres.' })
  @MaxLength(80, { message: 'La dirección no puede exceder los 80 caracteres.' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'El número de teléfono debe ser una cadena de texto.' })
  @Matches(/^\+?[0-9\s-]+$/, { message: 'El número de teléfono no es válido.' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'El país debe ser una cadena de texto.' })
  country?: string;

  @IsOptional()
  @IsString({ message: 'La ciudad debe ser una cadena de texto.' })
  city?: string;
}
