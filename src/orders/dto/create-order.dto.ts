import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { OrderStatus } from 'orders/entities/order.entity';

export class CreateOrderDto {
  @IsUUID()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly userId: number;

  @IsArray()
  @IsUUID(undefined, { each: true })
  readonly productIds: number[];

  @IsString()
  readonly shippingAddress: string;

  @IsEnum(OrderStatus)
  @IsOptional()
  readonly status?: OrderStatus;
}
