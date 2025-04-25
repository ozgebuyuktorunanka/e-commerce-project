import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { OrderStatus } from 'orders/entities/order.entity';

export class UpdateOrderDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  productIds?: string[];

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
