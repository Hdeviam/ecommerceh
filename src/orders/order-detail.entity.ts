import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../products/product.entity';

@Entity('order_details')
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Identificador único para el detalle de la orden

  @ManyToOne(() => Order, order => order.orderDetails, { onDelete: 'CASCADE' })
  order: Order; // Relación con la entidad Order

  @ManyToOne(() => Product) // Relación con Product
  product: Product; // Producto asociado al detalle de la orden

  @Column('int')
  quantity: number; // Cantidad del producto
}
