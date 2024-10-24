import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity'; // Ajusta según tu entidad

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async testConnection() {
    // Intenta realizar una consulta simple
    return await this.userRepository.find(); // Esto debería devolver todos los usuarios
  }
}
