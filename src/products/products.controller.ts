import { Controller, Put, Param, UploadedFile, UseGuards, UseInterceptors, BadRequestException, Get, Query, Post, Body, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ProductsService } from './products.service';
import { FilesService } from '../files/files.service';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role } from 'src/roles.enum';
import { Product } from './product.entity';
import { CreateProductDto } from './create-product.dto';
import { use } from 'passport';

@ApiTags("PRODUCTS")
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly filesService: FilesService
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Obtener todos los productos',
    description: 'Devuelve una lista de todos los productos con paginación.'
  })
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 5): Promise<Product[]> {
    return this.productsService.findAll(page, limit);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Obtener producto por ID',
    description: 'Devuelve un producto específico por su ID.'
  })
  @Get(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async findById(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Crear un nuevo producto',
    description: 'Crea un nuevo producto y lo retorna.'
  })
  @Post()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    if (createProductDto.imgUrl && this.isValidUrl(createProductDto.imgUrl)) {
      createProductDto.imgUrl = await this.filesService.uploadImageFromUrl(createProductDto.imgUrl);
    } else if (!createProductDto.imgUrl) {
      throw new BadRequestException('Una URL de imagen es requerida.');
    }

    return await this.productsService.create(createProductDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Actualizar un producto',
    description: 'Actualiza un producto existente y devuelve el producto actualizado.'
  })
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async update(@Param('id') id: string, @Body() updateProductDto: CreateProductDto): Promise<Product> {
    if (updateProductDto.imgUrl && this.isValidUrl(updateProductDto.imgUrl)) {
      updateProductDto.imgUrl = await this.filesService.uploadImageFromUrl(updateProductDto.imgUrl);
    }
    return await this.productsService.update(id, updateProductDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Subir imagen del producto',
    description: 'Carga una imagen y la asocia al producto especificado por ID.'
  })
  @Put('files/uploadImage/:id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Carga imagen',
    required: true,
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  async uploadProductImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<{ message: string; product: Product }> {
    if (!file) {
      throw new BadRequestException('El campo de la imagen es requerido');
    }

    const imageUrl = await this.filesService.uploadImage(file);
    await this.productsService.updateImage(id, imageUrl);

    const updatedProduct = await this.productsService.findOne(id);

    return { 
      message: 'La imagen ha sido subida y asociada al producto.',
      product: updatedProduct
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Eliminar un producto',
    description: 'Elimina un producto existente y devuelve un mensaje de éxito con el producto eliminado.'
  })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string; product: Product }> {
    const product = await this.productsService.remove(id);
    return {
      message: `El producto "${product.name}" ha sido eliminado con éxito.`,
      product,
    };
  }

  private isValidUrl(url: string): boolean {
    const urlPattern = new RegExp(/^(http|https):\/\/.+/);
    return urlPattern.test(url);
  }


@ApiBearerAuth()
@ApiOperation({ 
  summary: 'Obtener productos por categoría',
  description: 'Devuelve todos los productos asociados a una categoría específica por su ID.'
})
@UseGuards(AuthGuard)
@Get('category/:categoryId')
async findByCategory(@Param('categoryId') categoryId: string): Promise<Product[]> {
  return this.productsService.findByCategory(categoryId);
}



}
