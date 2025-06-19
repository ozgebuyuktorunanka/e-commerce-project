import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class CreateOrderDto {
  @IsUUID()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly userId!: number;

  @IsArray()
  @IsUUID(undefined, { each: true })
  readonly productIds!: number[];

  @IsString()
  @IsNotEmpty()
  readonly shippingAddress!: string;

  @IsEnum(OrderStatus)
  @IsString()
  @IsOptional()
  readonly status?: OrderStatus;
}
