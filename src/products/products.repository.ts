import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';

@Injectable()
export class ProductsRepository {
  private products: Product[] = [];

  async findAll(): Promise<Product[]> {
    return this.products; // Devuelve todos los productos
  }

  async findOne(id: string): Promise<Product | undefined> {
    return this.products.find(product => product.id === id);
  }

  async create(product: Product): Promise<Product> {
    this.products.push(product);
    return product;
  }

  async update(id: string, updatedProduct: Product): Promise<Product | undefined> {
    const index = this.products.findIndex(prod => prod.id === id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
      return updatedProduct; // Retorna el producto actualizado
    }
    return undefined; // Indica que no se encontró el producto
  }

  async remove(id: string): Promise<string | undefined> {
    const index = this.products.findIndex(prod => prod.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      return id; // Retorna el id del producto eliminado
    }
    return undefined; // Indica que no se encontró el producto
  }
}
