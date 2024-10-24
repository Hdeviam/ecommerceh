import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { CreateUserDto } from '../users/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserRepository', 
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create a user', async () => {
    const userDto: CreateUserDto = {
      email: 'test@test.com',
      name: 'Test User',
      password: 'plainPassword',
      confirmPassword: 'plainPassword',
      address: 'Address',
      phone: '1234567890',
      country: 'Country',
      city: 'City',
    };

    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const newUser: User = { 
      id: '1', 
      ...userDto, 
      password: hashedPassword, 
      orders: [], // Asegúrate de incluir esto
      isAdmin: false,
    };

    mockRepository.findOne.mockResolvedValue(null);
    mockRepository.create.mockReturnValue(newUser);
    mockRepository.save.mockResolvedValue(newUser);

    const result = await service.create(userDto);
    expect(result).toEqual(newUser);
    expect(mockRepository.save).toHaveBeenCalledWith(newUser);
  });

  it('should throw an error if the user already exists', async () => {
    const existingUser = { email: 'test@test.com' };
    mockRepository.findOne.mockResolvedValue(existingUser);
    await expect(service.create(existingUser as CreateUserDto)).rejects.toThrow(ConflictException);
  });
});
