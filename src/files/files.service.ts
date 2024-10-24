import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { v2 as cloudinaryV2 } from 'cloudinary';
import { Express } from 'express'; 
import { ProductsService } from '../products/products.service';
import { CreateProductDto } from '../products/create-product.dto';
import axios from 'axios';

@Injectable()
export class FilesService {
  constructor(
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {
    cloudinaryV2.config({
      cloud_name: 'dvm8mbi4y',
      api_key: '117638915716897',
      api_secret: 'LD--RB9RviYA8AnRFg5zjnsZ8aA',
    });
  }


  //--------------------------------------------------------------------------

  
  async uploadImage(file: Express.Multer.File): Promise<string> { 
    if (!file) {
      console.error('No file uploaded');
      throw new BadRequestException('No file uploaded');
    }
  
    return new Promise((resolve, reject) => {
      cloudinaryV2.uploader.upload_stream((error, result) => {
        if (error) {
          console.error('Error uploading image to Cloudinary:', error);
          return reject(new BadRequestException('Error uploading image'));
        }
        console.log('Image uploaded successfully:', result.url);
        resolve(result.url);
      }).end(file.buffer);
    });
  }

  

  //-------------------------------------------------------

  async updateProductImageFromUrl(productId: string, url: string): Promise<{ message: string }> {
    const product = await this.productsService.findOne(productId);
    if (!product) {
      console.error(`Product not found: ${productId}`);
      throw new NotFoundException('Product not found');
    }

    if (!url || !this.isValidUrl(url)) {
      console.error(`Invalid URL: ${url}`);
      throw new BadRequestException('Invalid URL');
    }

    const imageUrl = await this.uploadImageFromUrl(url);
    
    // Crea un DTO para actualizar el producto
    const updateProductDto: CreateProductDto = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imgUrl: imageUrl, // Actualiza con la nueva imagen
      categoryId: product.category.id, // Asegúrate de que categoryId esté presente
    };

    await this.productsService.update(productId, updateProductDto);

    return {
      message: 'La foto ha sido actualizada y subida en la plataforma.',
    };
  }

  public async uploadImageFromUrl(url: string): Promise<string> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');

      return new Promise((resolve, reject) => {
        cloudinaryV2.uploader.upload_stream((error, result) => {
          if (error) {
            console.error('Error uploading image from URL:', error);
            return reject(new BadRequestException('Error uploading image from URL'));
          }
          resolve(result.url);
        }).end(buffer);
      });
    } catch (error) {
      console.error('Error fetching image from URL:', error);
      throw new BadRequestException('Error fetching image from URL');
    }
  }

  private isValidUrl(url: string): boolean {
    const urlPattern = new RegExp(/^(http|https):\/\/.+/);
    return urlPattern.test(url);
  }
}
