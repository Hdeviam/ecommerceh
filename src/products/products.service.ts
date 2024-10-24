import { Injectable, NotFoundException, ConflictException, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { Product } from './product.entity';
import { CreateProductDto } from './create-product.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from '../files/files.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(forwardRef(() => FilesService))
    private readonly filesService: FilesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findByIds(productIds: string[]): Promise<Product[]> {
    const products = await this.productRepository.findByIds(productIds);
    if (!products || products.length === 0) {
      throw new NotFoundException('Products not found');
    }
    return products;
  }

  async findAll(page: number, limit: number): Promise<Product[]> {
    return this.productRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      console.error(`Product not found: ${id}`);
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });

    if (existingProduct) {
      throw new ConflictException('Product with this name already exists');
    }

    const categories = await this.categoriesService.getCategories();
    const foundCategory = categories.find(cat => cat.id === createProductDto.categoryId);

    if (!foundCategory) {
      throw new NotFoundException('Category not found');
    }

    // Manejo de imgUrl
    if (createProductDto.imgUrl && this.isValidUrl(createProductDto.imgUrl)) {
      createProductDto.imgUrl = await this.filesService.uploadImageFromUrl(createProductDto.imgUrl);
    } else if (!createProductDto.imgUrl) {
      throw new BadRequestException('Una URL de imagen es requerida.');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      category: foundCategory,
    });

    return this.productRepository.save(product);
  }

  async update(id: string, updateProductDto: CreateProductDto): Promise<Product> {
    const existingProduct = await this.findOne(id);

    if (updateProductDto.categoryId) {
      const categories = await this.categoriesService.getCategories();
      const foundCategory = categories.find(cat => cat.id === updateProductDto.categoryId);
      if (!foundCategory) {
        throw new NotFoundException('Category not found');
      }
      existingProduct.category = foundCategory; // Actualiza la relación
    }

    // Manejo de imgUrl al actualizar
    if (updateProductDto.imgUrl && this.isValidUrl(updateProductDto.imgUrl)) {
      updateProductDto.imgUrl = await this.filesService.uploadImageFromUrl(updateProductDto.imgUrl);
    }

    existingProduct.name = updateProductDto.name;
    existingProduct.description = updateProductDto.description;
    existingProduct.price = updateProductDto.price;
    existingProduct.stock = updateProductDto.stock ?? existingProduct.stock; // Mantiene el stock anterior si no se proporciona
    existingProduct.imgUrl = updateProductDto.imgUrl; // Asegúrate de actualizar el imgUrl

    return this.productRepository.save(existingProduct);
  }

  async updateImage(id: string, imgUrl: string): Promise<Product> { // Método para actualizar la imagen
    const product = await this.findOne(id);
    product.imgUrl = imgUrl; // Actualiza la URL de la imagen

    return this.productRepository.save(product); // Guarda el producto actualizado
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      console.error(`Product not found for removal: ${id}`);
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.remove(product);
    return product; // Retornar el producto eliminado
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stock -= quantity; // Descontar la cantidad
    return this.productRepository.save(product); // Guardar el producto actualizado
  }

  async addProducts(): Promise<Product[]> {
    // Aquí puedes definir la lógica para agregar productos de prueba
    const products = [
      { name: 'Producto 1', description: 'Descripción 1', price: 100, stock: 10, imgUrl: 'url1', categoryId: '1' },
      { name: 'Producto 2', description: 'Descripción 2', price: 200, stock: 20, imgUrl: 'url2', categoryId: '1' },
      // Agrega más productos según sea necesario
    ];

    const createdProducts = [];

    for (const productDto of products) {
      const createdProduct = await this.create(productDto);
      createdProducts.push(createdProduct);
    }

    return createdProducts;
  }

  private isValidUrl(url: string): boolean {
    const urlPattern = new RegExp(/^(http|https):\/\/.+/);
    return urlPattern.test(url);
  }



  
  async findByCategory(categoryId: string): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category'], // Si necesitas cargar la relación
    });
    
    if (!products.length) {
      throw new NotFoundException('No products found for this category');
    }
    
    return products;
  }

  

}
