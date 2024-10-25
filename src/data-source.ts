import { DataSource } from 'typeorm';
import { User } from './users/user.entity'; // Asegúrate de ajustar esta ruta según la ubicación real

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'ecommerce',
  entities: [User], // Asegúrate de incluir todas tus entidades aquí
  migrations: [],
  synchronize: false, // Usa migraciones en lugar de sincronización automática
});

// Manejo de conexión
AppDataSource.initialize()
  .then(() => {
    console.log('Base de datos conectada con éxito!');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });
