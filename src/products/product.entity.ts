import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity('products')
export class Product {


   /**
   * @description Este sera el ID
   * @example UUID
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;


   /**
   * @description Este sera el nombre
   * @example Zapatos 
   */
  @Column({ length: 50 })
  name: string;


     /**
   * @description Este sera la descripcion
   * @example Zapatos para GYM 
   */
  @Column('text')
  description: string;


     /**
   * @description Este sera el precio
   * @example 10.23
   */
  @Column('decimal')
  price: number;


     /**
   * @description Este sera la cantidad que tendras disponible
   * @example 20
   */
  @Column('int', { nullable: true })
  stock: number;


     /**
   * @description Este sera IMG URL
   * @example www.Zapatos.com.co
   */
  @Column('text', { nullable: true })
  imgUrl: string;


     /**
   * @description Este sera la categoria
   * @example Para dormir
   */
  @ManyToOne(() => Category, category => category.products, { eager: true })
  category: Category;

  
}
