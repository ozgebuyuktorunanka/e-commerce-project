import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { OrderStatus } from 'orders/entities/order.entity';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  userId: number;

  @IsArray()
  @IsUUID(undefined, { each: true })
  productIds: number[];

  @IsString()
  shippingAddress: string;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

}
