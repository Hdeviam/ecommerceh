import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity'; // Importar la entidad Order

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    TypeOrmModule.forFeature([Order]), // Agregar el repositorio de Order
  ],
  providers: [OrdersService, OrdersRepository],
  controllers: [OrdersController],
})
export class OrdersModule {}
