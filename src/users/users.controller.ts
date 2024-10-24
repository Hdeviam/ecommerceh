import { Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query, 
  UseGuards, 
  NotFoundException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';

@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Obtener todos los usuarios',
    description: 'Devuelve una lista de todos los usuarios con paginación.'
  })
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 5): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersService.findAll(page, limit);
    return users.map(user => {
      const { password, ...rest } = user;
      return rest;
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Obtener usuario por ID',
    description: 'Devuelve un usuario específico por su ID, incluyendo órdenes si las tiene.'
  })
  @Get(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async findById(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findUserWithOrders(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...rest } = user;
    return rest;
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Crear un nuevo usuario',
    description: 'Crea un nuevo usuario y devuelve los datos del usuario creado.'
  })
  //@Post()
  async create(@Body() userDto: CreateUserDto): Promise<Partial<User>> {
    console.log('Creating user with data:', userDto);
    const user = await this.usersService.create(userDto);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      country: user.country,
      city: user.city,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Actualizar un usuario',
    description: 'Actualiza un usuario existente y devuelve los datos del usuario actualizado.'
  })
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async update(@Param('id') id: string, @Body() userDto: UpdateUserDto): Promise<Partial<User>> {
    const updatedUser = await this.usersService.update(id, userDto);
    const { id: _, password, isAdmin, ...rest } = updatedUser;
    return rest;
  }
  
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Eliminar un usuario',
    description: 'Elimina un usuario existente y devuelve un mensaje de éxito.'
  })
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async delete(@Param('id') id: string): Promise<string> {
    try {
      const result = await this.usersService.remove(id);
      if (!result) {
        throw new NotFoundException('User not found');
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user');
    }
  }
}
