import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Category } from './category.entity';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './create-category.dto'; 
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async addCategories(): Promise<void> {
    const categories: { name: string; description: string }[] = [
      { name: 'Electronics', description: 'Devices and gadgets' },
      { name: 'Books', description: 'Various genres of books' },
      { name: 'Clothing', description: 'Apparel and accessories' },
    ];

    for (const category of categories) {
      const existingCategory = await this.categoriesRepository.findOneByName(category.name);
      if (!existingCategory) {
        const newCategory: Category = {
          id: uuidv4(),
          ...category,
          products: [],
        };
        await this.categoriesRepository.addCategory(newCategory); 
      }
    }
  }







  
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Verificar si la categoría ya existe
    const existingCategory = await this.categoriesRepository.findOneByName(createCategoryDto.name);
    if (existingCategory) {
      throw new ConflictException('la categoria ya existe'); // Lanzar excepción si la categoría ya existe
    }

    const newCategory: Category = {
      id: uuidv4(),
      ...createCategoryDto,
      products: [],
    };
    await this.categoriesRepository.addCategory(newCategory);
    return newCategory;
  }





  async getCategories(): Promise<Category[]> {
    return await this.categoriesRepository.getCategories();
  }
}
