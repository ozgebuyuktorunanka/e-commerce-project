import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';
import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsString()
  readonly shippingAddress?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  readonly status?: OrderStatus;
}
