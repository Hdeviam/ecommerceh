import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { CreateUserDto } from '../users/create-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ValidationPipe } from '../pipes/validation.pipe';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Maneja el inicio de sesión de un usuario. Devuelve el usuario autenticado.',
  })
  @Post('signin')
  @UsePipes(ValidationPipe) // Aplica el pipe de validación
  async signIn(@Body() signInDto: SignInDto) {
    const foundUser = await this.authService.signin(signInDto);
    return foundUser;
  }

  @ApiOperation({ 
    summary: 'Registrar usuario',
    description: 'Maneja el registro de un nuevo usuario. Devuelve el usuario registrado sin la contraseña.',
  })
  @Post('signup')
  async signUp(@Body() userData: CreateUserDto) {
    const userWithoutPassword = await this.authService.signup(userData);
    const logStatus = await this.authService.signin({
      email: userData.email,
      password: userData.password,
    });
    return {
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        name: userWithoutPassword.name,
        address: userWithoutPassword.address,
        phone: userWithoutPassword.phone,
        country: userWithoutPassword.country,
        city: userWithoutPassword.city,
      },
    };
  }
}
