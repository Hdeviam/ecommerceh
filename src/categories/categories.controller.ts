import { Controller, Post, Body, ConflictException, Get, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './create-category.dto';
import { Category } from './category.entity';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles.enum';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@ApiTags('CATEGORIES')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Crear una nueva categoría',
    description: 'Crea una nueva categoría y devuelve la categoría creada.'
  })
  @Post()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true })) // Usar ValidationPipe para validar DTO
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      return await this.categoriesService.createCategory(createCategoryDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error; // Re-lanzar cualquier otro error
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Obtener todas las categorías',
    description: 'Devuelve una lista de todas las categorías disponibles.'
  })
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.getCategories();
  }
}
