import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../categories/categories.service';
import { CategoriesRepository } from '../categories/categories.repository';
import { CreateCategoryDto } from '../categories/create-category.dto';
import { Category } from '../categories/category.entity';
import { ConflictException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: CategoriesRepository;

  const mockCategory: Category = {
    id: uuidv4(),
    name: 'Test Category',
    description: 'Test Description',
    products: [],
  };

  const mockCategoriesRepository = {
    findOneByName: jest.fn(),
    addCategory: jest.fn(),
    getCategories: jest.fn().mockResolvedValue([mockCategory]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: CategoriesRepository, useValue: mockCategoriesRepository },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<CategoriesRepository>(CategoriesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a category', async () => {
    const createCategoryDto: CreateCategoryDto = { name: 'New Category', description: 'Description' };
    mockCategoriesRepository.findOneByName.mockResolvedValue(null); // Simular que no existe

    const result = await service.createCategory(createCategoryDto);
    expect(result).toEqual(expect.objectContaining({ name: 'New Category' }));
    expect(mockCategoriesRepository.addCategory).toHaveBeenCalledWith(result);
  });

  it('should throw a ConflictException if category already exists', async () => {
    const createCategoryDto: CreateCategoryDto = { name: 'Existing Category' };
    mockCategoriesRepository.findOneByName.mockResolvedValue(mockCategory); // Simular que ya existe

    await expect(service.createCategory(createCategoryDto)).rejects.toThrow(ConflictException);
  });

  it('should return all categories', async () => {
    const result = await service.getCategories();
    expect(result).toEqual([mockCategory]);
  });
});
