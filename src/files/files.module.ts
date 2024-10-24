import { Module, forwardRef } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { JwtModule } from '@nestjs/jwt'; 
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    JwtModule,
    forwardRef(() => ProductsModule), // Importa el ProductsModule
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService], // Asegúrate de exportar el FilesService
})
export class FilesModule {}
