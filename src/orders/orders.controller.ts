import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { OrderService } from './orders.service';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: number): Promise<Order[]> {
    return this.orderService.findByUser(userId);
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.orderService.update(id, updateOrderDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: number,
    @Body('status') status: OrderStatus,
  ): Promise<Order> {
    return this.orderService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.orderService.remove(id);
  }
}
