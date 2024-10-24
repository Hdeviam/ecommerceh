import { IsUUID, IsNumber, IsArray, IsString } from 'class-validator';
import { OrderDetailResponseDto } from './order-detail-response.dto'; // Asegúrate de tener este DTO

export class OrderResponseDto {
  @IsUUID()
  id: string;

  @IsNumber()
  total: number;

  @IsUUID()
  userId: string;

  @IsArray()
  orderDetails: OrderDetailResponseDto[]; // Agrega este campo para los detalles de la orden
}


