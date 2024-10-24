// src/database/seeder.ts
import { AppDataSource } from '../ormconfig'; // Ajusta la ruta si es necesario
import { Category } from '../categories/category.entity';
import { Product } from '../products/product.entity';

const categoriesData = [
  { name: 'Electronics', description: 'Devices and gadgets' },
  { name: 'Books', description: 'Various genres of books' },
  { name: 'Clothing', description: 'Apparel and accessories' },
];

const productsData = [
  { name: 'Smartphone', description: 'Latest model smartphone', price: 699.99, stock: 50, imgUrl: 'default-image-url.jpg', category: null },
  { name: 'Laptop', description: 'High-performance laptop', price: 1299.99, stock: 30, imgUrl: 'default-image-url.jpg', category: null },
  { name: 'Novel', description: 'Interesting novel', price: 19.99, stock: 100, imgUrl: 'default-image-url.jpg', category: null },
];

async function seedDatabase() {
  const connection = await AppDataSource.initialize();

  const categoryRepo = connection.getRepository(Category);
  const productRepo = connection.getRepository(Product);

  // Insert Categories
  for (const category of categoriesData) {
    const existingCategory = await categoryRepo.findOneBy({ name: category.name });
    if (!existingCategory) {
      const newCategory = categoryRepo.create(category);
      await categoryRepo.save(newCategory);
      console.log(`Category ${category.name} seeded.`);
    }
  }

  // Fetch all categories to link with products
  const categories = await categoryRepo.find();

  // Insert Products
  for (const product of productsData) {
    const category = categories.find(cat => cat.name === product.category);
    product.category = category; // Asignar la categoría correspondiente
    const existingProduct = await productRepo.findOneBy({ name: product.name });
    if (!existingProduct) {
      const newProduct = productRepo.create(product);
      await productRepo.save(newProduct);
      console.log(`Product ${product.name} seeded.`);
    }
  }

  await connection.destroy();
}

seedDatabase().catch(err => console.log(err));
