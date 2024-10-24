import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/signin.dto';
import { CreateUserDto } from '../users/create-user.dto';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWithoutPassword } from 'src/types/userWithoutPassword.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User> ,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signin(signInDto: SignInDto) {
    const userExists: User[] = await this.userRepository.find({
      where: { email: signInDto.email },
    });
  
    if (userExists.length === 0) {
      throw new NotFoundException('User does not exist');
    }
  
    const userFound: User = await this.userRepository.findOne({
      where: { email: signInDto.email },
    });
  
    console.log('User found:', userFound);
    console.log('Contraseña ingresada:', signInDto.password);
    console.log('Hash guardado:', userFound.password);
    
    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      userFound.password,
    );
  
    console.log(`¿La contraseña es válida?: ${isPasswordValid}`);
  
    if (isPasswordValid) {
      const payload = { 
        email: userFound.email, 
        sub: userFound.id, // Cambiado a userFound.id para mantener el ID en el payload
        isAdmin: userFound.isAdmin
      };
  
      const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
  
      return {
        message: "Usuario logeado",
        userID: userFound.id,
        token: accessToken,
        isAdmin: userFound.isAdmin       };
    } else {
      throw new BadRequestException('Incorrect Credentials');
    }
  }
  






  async signup(createUserDto: CreateUserDto) {
    // Verifica si ya existe un usuario con el mismo correo electrónico
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });

    if (existingUser) {
        throw new BadRequestException('Ya hay un usuario existente con las credenciales que está ingresando, valide.');
    }

    const newUser: User = this.userRepository.create(createUserDto);
    const { password } = newUser;

    // Encripta la contraseña utilizando bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    newUser.password = hashedPassword;

    // Guarda el nuevo usuario en la base de datos
    await this.userRepository.save(newUser);

    // Busca el usuario recién creado sin la contraseña
    const user: UserWithoutPassword = await this.usersService.findOne(newUser.id);
    const { orders, isAdmin, ...UserWithoutPassword } = user;

    return UserWithoutPassword;
}
}