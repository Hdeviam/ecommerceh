import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(page: number, limit: number): Promise<User[]> {
    const [result] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return result;
  }

  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async update(id: string, updatedUser: User): Promise<User> {
    await this.userRepository.update(id, updatedUser);
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<string | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      await this.userRepository.remove(user);
      return id.toString();
    }
    return null;
  }

  async findUserWithOrders(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['orders'],
    });
  }
}
