import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  name: string;

  @Column('text', { nullable: true }) // Mantener nullable para que sea opcional
  description?: string; // Marcar como opcional

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}
