import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Order } from './order.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  async addOrder(userId: string, productsData: { id: string; quantity: number }[]): Promise<Order> {
    const user: User = await this.getUserById(userId);
    const products: Product[] = await this.getProductsByIds(productsData.map(product => product.id));

    if (!user) {
      throw new BadRequestException(`Invalid user ID: ${userId}. User not found.`);
    }

    if (products.length === 0) {
      throw new BadRequestException(`Invalid products. Product IDs provided: ${productsData.map(p => p.id).join(', ')}`);
    }

    // Validar y descontar stock
    for (const productData of productsData) {
      const product = products.find(p => p.id === productData.id);
      if (!product || product.stock < productData.quantity) {
        throw new BadRequestException(`Insufficient stock for product ID: ${productData.id}. Available: ${product?.stock || 0}, Required: ${productData.quantity}`);
      }
    }

    // Calcular el total de la orden
    const total = products.reduce((acc, product) => {
      const quantity = productsData.find(p => p.id === product.id)?.quantity || 0;
      return acc + product.price * quantity;
    }, 0);

    try {
      // Llamar al repositorio para agregar la orden
      const savedOrder = await this.ordersRepository.addOrder(user, productsData, total);

      // Descontar stock después de crear la orden
      await Promise.all(productsData.map(async productData => {
        await this.productsService.updateStock(productData.id, productData.quantity);
      }));

      return savedOrder;
    } catch (error) {
      console.error('Error al guardar la orden:', error);
      throw new BadRequestException('No se pudo crear la orden');
    }
  }

  async getOrder(id: string): Promise<Order> {
    const order = await this.ordersRepository.getOrder(id);
    if (!order) {
      throw new NotFoundException(`Order with ID: ${id} not found.`);
    }
    return order;
  }

  private async getUserById(userId: string): Promise<User> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID: ${userId} not found.`);
    }
    return user;
  }

  private async getProductsByIds(productIds: string[]): Promise<Product[]> {
    const products = await this.productsService.findByIds(productIds);
    if (!products || products.length === 0) {
      throw new NotFoundException(`No products found for the following IDs: ${productIds.join(', ')}`);
    }
    return products;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const orders = await this.ordersRepository.getOrdersByUserId(userId);
    if (!orders.length) {
      throw new NotFoundException(`No orders found for user ID: ${userId}.`);
    }
    return orders;
  }
}
