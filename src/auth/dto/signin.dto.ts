import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class SignInDto {
  
  /**
   * @description Este es tu correo electrónico
   * @example meow@gmail.com
   */
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  email: string;

  /**
   * @description La contraseña de tu cuenta
   * @example Coin12378!
   */
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  password: string;
}
