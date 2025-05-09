import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { OrderStatus } from 'orders/entities/order.entity';

export class UpdateOrderDto {
  @IsUUID()
  @IsOptional()
  readonly userId?: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  readonly productIds?: string[];

  @IsOptional()
  @IsString()
  readonly shippingAddress?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  readonly status?: OrderStatus;
}
