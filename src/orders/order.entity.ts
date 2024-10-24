import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { OrderDetail } from './order-detail.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Identificador único de la orden

  @ManyToOne(() => User, user => user.orders)
  user: User; // Relación con la entidad User, representa el usuario que realizó la orden

  @Column('decimal', { precision: 10, scale: 2 })
  total: number; // Total de la orden

  @OneToMany(() => OrderDetail, orderDetail => orderDetail.order, {
    cascade: true, // Permite que los detalles de la orden se guarden automáticamente al guardar la orden
  })
  orderDetails: OrderDetail[]; // Detalles de la orden (productos comprados)
}
