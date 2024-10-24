import { Module, forwardRef } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { FilesModule } from '../files/files.module';
import { CategoriesModule } from '../categories/categories.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => FilesModule), // Usa forwardRef aquí
    forwardRef(() => AuthModule),
    CategoriesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService], // Asegúrate de exportar el ProductsService
})
export class ProductsModule {}
