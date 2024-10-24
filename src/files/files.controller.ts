import { Controller, Post, UseInterceptors, UploadedFile, Param, UsePipes, Body, UseGuards, BadRequestException, Put } from '@nestjs/common'; 
import { FilesService } from './files.service'; 
import { FileInterceptor } from '@nestjs/platform-express'; 
import { Express } from 'express'; 
import { ImageValidationPipe } from '../pipes/image-validation.pipe'; 
import { ProductsService } from '../products/products.service'; 
import { CreateProductDto } from '../products/create-product.dto'; 
import { AuthGuard } from '../guards/auth.guard'; 
import { RolesGuard } from 'src/guards/roles.guard';
import { Role } from 'src/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@Controller()
export class FilesController {
  constructor(
    private readonly filesService: FilesService, 
    private readonly productsService: ProductsService, 
  ) {}

  @UseGuards(AuthGuard) 
 // @Post('upload') 
  @UseInterceptors(FileInterceptor('file')) 
  @UsePipes(new ImageValidationPipe()) 
  async uploadFile(@UploadedFile() file: Express.Multer.File) { 
    return await this.filesService.uploadImage(file); 
  }
 
  //@Post('create')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard) 
  @UseInterceptors(FileInterceptor('file')) 
  @UsePipes(new ImageValidationPipe()) 
  async createProduct(@UploadedFile() file: Express.Multer.File, @Body() createProductDto: CreateProductDto) { 
    if (!file) {
      throw new BadRequestException('File is required to create a product.');
    }
    return await this.productsService.create(createProductDto); 
  }

  @UseGuards(AuthGuard) 
  //@Post('updateProduct/:id') 
  @UseInterceptors(FileInterceptor('file')) 
  @UsePipes(new ImageValidationPipe()) 
  async updateProduct(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body() updateProductDto: CreateProductDto) { 
    return await this.productsService.update(id, updateProductDto); 
  }

  // Cambiado a PUT para actualizar la imagen del producto
  @UseGuards(AuthGuard) 
  //@Put('uploadImage/:id') 
  @UseInterceptors(FileInterceptor('file')) 
  @UsePipes(new ImageValidationPipe()) 
  async uploadProductImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) { // Validación para asegurar que se ha subido un archivo
      throw new BadRequestException('File is required to update the product image.');
    }
    const imageUrl = await this.filesService.uploadImage(file); // Sube la imagen y obtiene la URL
    return this.productsService.updateImage(id, imageUrl); // Actualiza la imagen del producto
  }

  //@Post('uploadImageFromUrl/:id')
  async uploadProductImageFromUrl(@Param('id') 
  id: string,
   @Body('url')
    url: string) {
    if (!url) {
      console.error('URL is missing in the request body');
      throw new BadRequestException('URL is required');
    }
    return this.filesService.updateProductImageFromUrl(id, url);
  }
}

