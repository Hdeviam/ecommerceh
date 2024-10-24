import { IsNotEmpty, IsArray, ValidateNested, IsUUID, IsPositive, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
  @IsUUID() // Valida que sea un UUID
  @IsNotEmpty({ message: 'El ID del producto es obligatorio.' })
  id: string; // ID del producto

  @IsPositive({ message: 'La cantidad debe ser un número positivo.' }) // Asegura que la cantidad sea positiva
  @IsNotEmpty({ message: 'La cantidad es obligatoria.' }) // Asegura que no esté vacío
  quantity: number; // Cantidad del producto
}

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio.' })
  userId: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Se debe proporcionar al menos un producto.' })
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: { id: string; quantity: number }[]; // Cambia productId a id
}
