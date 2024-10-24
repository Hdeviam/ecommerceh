import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {

/**
 * @description Esta será la categoría.
 * @example Zapatos
 */
@IsString()
@IsNotEmpty()
name: string;


  /**
 * @description Esta será la categoría.
 * @example Zapatos
 */
  @IsString()
  @IsNotEmpty()
  description: string;

  /**
 * @description Esta será la categoría.
 * @example Zapatos
 */
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  imgUrl?: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
