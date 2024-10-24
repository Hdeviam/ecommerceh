import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

    /**
   * @description Este debe ser un nombre
   * @example Para niño
   */
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  name: string;


    /**
   * @description Una descripcion corta
   * @example Accesorio para niño
   */
  @IsString()
  @IsOptional()
  description?: string;
}
