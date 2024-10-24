import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App E2E Tests', () => {
  let app: INestApplication;
  let categoryId: string;
  let productId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should sign up a user successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
        address: '123 Test St',
        phone: '+1234567890',
        country: 'Testland',
        city: 'Test City',
        confirmPassword: 'Password123!',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('User Data');
    expect(response.body).toHaveProperty('Log Status');
  });

  it('should sign in a user successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', 'test@example.com');
  });

  it('should create a category successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/categories')
      .send({ name: 'Test Category' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', 'Test Category');
    categoryId = response.body.id; // Guarda el ID de la categoría creada
  });

  it('should retrieve all categories', async () => {
    const response = await request(app.getHttpServer())
      .get('/categories');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a product successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 50,
        categoryId: categoryId, // Usa el ID de la categoría creada
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', 'Test Product');
    productId = response.body.id; // Guarda el ID del producto creado
  });

  it('should retrieve all products', async () => {
    const response = await request(app.getHttpServer())
      .get('/products');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should delete a product successfully', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/products/${productId}`); // Usa el ID del producto creado

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });
});
