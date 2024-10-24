import { Injectable } from '@nestjs/common';
import { Order } from './order.entity';
import { OrderDetail } from './order-detail.entity';
import { ProductsService } from '../products/products.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly productsService: ProductsService,
  ) {}

  async addOrder(user: User, productsData: { id: string; quantity: number }[], total: number): Promise<Order> {
    const order = new Order();
    order.user = user;
    order.total = total;

    // Crear detalles de la orden
    order.orderDetails = await Promise.all(productsData.map(async (productData) => {
      const detail = new OrderDetail();
      const product = await this.productsService.findOne(productData.id);
      detail.product = product;
      detail.quantity = productData.quantity;
      detail.order = order; // Asociar el detalle con la orden
      return detail;
    }));

    // Guardar la orden y los detalles en la base de datos
    return this.ordersRepository.save(order);
  }

  async getOrder(id: string): Promise<Order> {
    return this.ordersRepository.findOne({
      where: { id },
      relations: ['orderDetails', 'user', 'orderDetails.product'],
    });
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return this.ordersRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.orderDetails', 'orderDetail')
      .leftJoinAndSelect('orderDetail.product', 'product')
      .leftJoinAndSelect('order.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }
}
