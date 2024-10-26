import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable() 
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: userDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El usuario ya está registrado con este correo.');
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user = this.usersRepository.create({ ...userDto, password: hashedPassword });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id: id } });
  }

  async findAll(page: number, limit: number): Promise<User[]> {
    return this.usersRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findUserWithOrders(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id: id}});
  }

  async update(id: string, userDto: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, userDto);
    return this.findUserWithOrders(id);
  }



  async remove(id: string): Promise<string> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.remove(user);
    return 'Usuario eliminado con exito';
  }
  


}
