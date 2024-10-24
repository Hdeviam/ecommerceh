import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../categories/categories.controller';
import { CategoriesService } from '../categories/categories.service';
import { CreateCategoryDto } from '../categories/create-category.dto';
import { Category } from '../categories/category.entity';
import { ConflictException } from '@nestjs/common';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategory: Category = { id: '1', name: 'Test Category', description: 'Test Description', products: [] };

  const mockCategoriesService = {
    createCategory: jest.fn(),
    getCategories: jest.fn().mockResolvedValue([mockCategory]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: mockCategoriesService }],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a category', async () => {
    const createCategoryDto: CreateCategoryDto = { name: 'New Category', description: 'Description' };
    mockCategoriesService.createCategory.mockResolvedValue(mockCategory);

    const result = await controller.create(createCategoryDto);
    expect(result).toEqual(mockCategory);
  });

  it('should throw a ConflictException if category already exists', async () => {
    const createCategoryDto: CreateCategoryDto = { name: 'Existing Category' };
    mockCategoriesService.createCategory.mockRejectedValue(new ConflictException('la categoria ya existe'));

    await expect(controller.create(createCategoryDto)).rejects.toThrow(ConflictException);
  });

  it('should return all categories', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockCategory]);
  });
});
