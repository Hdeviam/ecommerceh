import { DataSource } from 'typeorm';
import { User } from './users/user.entity'; // Ajusta la ruta según la ubicación real

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'postgres',
  entities: [User], // Asegúrate de incluir tus entidades aquí
  migrations: [],
  synchronize: false, // Deberías usar migraciones en lugar de sincronización automática
});
