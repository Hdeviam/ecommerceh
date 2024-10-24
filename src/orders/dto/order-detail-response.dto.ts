import { IsUUID, IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class OrderDetailResponseDto {
  @IsUUID()
  @IsNotEmpty({ message: 'El ID del producto es obligatorio.' })
  productId: string;

  @IsNumber({}, { message: 'La cantidad debe ser un número.' })
  @IsNotEmpty({ message: 'La cantidad es obligatoria.' })
  quantity: number;

  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @IsNotEmpty({ message: 'El precio es obligatorio.' })
  price: number;

  @IsString({ message: 'El nombre del producto es obligatorio.' })
  productName: string;

  @IsNumber({}, { message: 'El subtotal debe ser un número.' })
  @IsNotEmpty({ message: 'El subtotal es obligatorio.' })
  subtotal: number;

  @IsString({ message: 'La URL de la imagen es obligatoria.' })
  imgUrl: string;

  @IsString({ message: 'La descripción es obligatoria.' })
  description: string;
}
