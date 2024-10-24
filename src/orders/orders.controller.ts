import { Controller, Post, Body, Get, Param, UsePipes, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { ValidationPipe } from '../pipes/validation.pipe';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrderResponseDto } from './dto/order-response.dto';

@ApiTags('ORDERS')
@ApiBearerAuth()
@Controller('orders')
@UsePipes(new ValidationPipe())
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ 
    summary: 'Crear un nuevo pedido',
    description: 'Crea un nuevo pedido y devuelve el pedido creado.'
  })
  @Post()
  async addOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    try {
      const order = await this.ordersService.addOrder(createOrderDto.userId, createOrderDto.products);
      return this.mapOrderToResponse(order);
    } catch (error) {
      throw new BadRequestException('Error al crear el pedido: ' + error.message);
    }
  }

  @ApiOperation({ 
    summary: 'Obtener un pedido por ID',
    description: 'Devuelve un pedido específico basado en el ID proporcionado.'
  })
  @Get(':id')
  async getOrder(@Param('id') id: string): Promise<OrderResponseDto> {
    const order = await this.ordersService.getOrder(id);
    return this.mapOrderToResponse(order);
  }

  @ApiOperation({ 
    summary: 'Obtener todas las órdenes de un usuario',
    description: 'Devuelve todas las órdenes asociadas a un ID de usuario específico.'
  })
  @Get('users/:userId')
  async getOrdersByUser(@Param('userId') userId: string): Promise<OrderResponseDto[]> {
    try {
      const orders = await this.ordersService.getOrdersByUserId(userId);
      return orders.map(order => this.mapOrderToResponse(order));
    } catch (error) {
      throw new BadRequestException('Error al obtener órdenes: ' + error.message);
    }
  }

  private mapOrderToResponse(order: Order): OrderResponseDto {
    const total = typeof order.total === 'number' ? order.total : parseFloat(order.total);

    return {
      id: order.id,
      total: Number(total.toFixed(2)),
      userId: order.user.id,
      orderDetails: order.orderDetails.map(detail => ({
        productId: detail.product.id,
        quantity: detail.quantity,
        price: Number(detail.product.price),
        productName: detail.product.name,
        subtotal: Number((detail.product.price * detail.quantity).toFixed(2)),
        imgUrl: detail.product.imgUrl,
        description: detail.product.description,
      })),
    };
  }
}
