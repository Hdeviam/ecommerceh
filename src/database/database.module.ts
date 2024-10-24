import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../ormconfig'; // Asegúrate de que la ruta sea correcta

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options)], // Asegúrate de usar AppDataSource.options
  exports: [TypeOrmModule], // Exporta TypeOrmModule para su uso en otros módulos
})
export class DatabaseModule {}
