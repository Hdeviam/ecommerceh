import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/user.entity';
import { SignInDto } from '../auth/dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Roles } from '../decorators/roles.decorator'; // O ajusta la ruta según tu estructura


describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUsersService = {
    findUserByEmail: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'UserRepository', useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should sign in a user and return a token', async () => {
    const signInDto: SignInDto = { email: 'test@test.com', password: 'plainPassword' };

    const hashedPassword = await bcrypt.hash('plainPassword', 10);
    const mockUser: User = {
      id: '1',
      email: 'test@test.com',
      name: 'Test User',
      password: hashedPassword,
      address: 'Address',
      phone: '1234567890',
      country: 'Country',
      city: 'City',
      orders: [],
      isAdmin: false,
    };

    mockUserRepository.find.mockResolvedValue([mockUser]); // Simula que se encuentra el usuario
    mockUserRepository.findOne.mockResolvedValue(mockUser); // Asegura que findOne también devuelve el usuario
    mockJwtService.sign.mockReturnValue('token');

    const result = await service.signin(signInDto);
    expect(result).toHaveProperty('token', 'token');
    expect(result).toHaveProperty('userID', '1');
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const signInDto: SignInDto = { email: 'test@test.com', password: 'plainPassword' };
    mockUserRepository.find.mockResolvedValue([]); // Simula que no hay usuarios
    mockUserRepository.findOne.mockResolvedValue(null); // Asegura que findOne no devuelve usuario

    await expect(service.signin(signInDto)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if password is incorrect', async () => {
    const signInDto: SignInDto = { email: 'test@test.com', password: 'wrongPassword' };

    const hashedPassword = await bcrypt.hash('plainPassword', 10);
    const mockUser: User = {
      id: '1',
      email: 'test@test.com',
      name: 'Test User',
      password: hashedPassword,
      address: 'Address',
      phone: '1234567890',
      country: 'Country',
      city: 'City',
      orders: [],
      isAdmin: false,
    };

    mockUserRepository.find.mockResolvedValue([mockUser]); // Simula que se encuentra el usuario
    mockUserRepository.findOne.mockResolvedValue(mockUser); // Asegura que findOne también devuelve el usuario
    mockJwtService.sign.mockReturnValue('token');

    await expect(service.signin(signInDto)).rejects.toThrow(BadRequestException);
  });
});
