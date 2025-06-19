import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, } from '@nestjs/common';
import { OrderService } from './orders.service';
import { Order } from '../../libs/src/orders/entities/order.entity';
import { CreateOrderDto } from '../../libs/src/orders/dto/create-order.dto';
import { UpdateOrderDto } from '../../libs/src/orders/dto/update-order.dto';
import { OrderStatus } from '../../libs/src/orders/entities/order.entity';
import { ParseIntPipe } from '../../libs/src/pipes/parse-int.pipe';
import { JwtAuthGuard } from '../../libs/src/authService/jwt/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly orderService: OrderService) { }

  @Get()
  async findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<Order[]> {
    return this.orderService.findByUser(userId);
  }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.orderService.update(id, updateOrderDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: OrderStatus,
  ): Promise<Order> {
    return this.orderService.updateStatus(id, status);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.orderService.remove(id);
  }
}
