import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import { Order } from '../orders/order.entity';
import { UUID } from 'crypto';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column() 
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column({
    type: 'boolean',
    default:false,
  })
  isAdmin: boolean


  @OneToMany(() => Order, (order) => order.user)
  @JoinColumn({ name: 'orders_id' })
  orders: Order[];
}
