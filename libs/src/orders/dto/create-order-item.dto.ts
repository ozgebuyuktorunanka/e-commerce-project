
import { IsNumber, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  @IsPositive()
  productId!: number;

  @IsNumber()
  @IsPositive()
  quantity!: number;

  @IsNumber()
  @IsPositive()
  unitPrice!: number;

  @IsNumber()
  @IsPositive()
  totalPrice!: number;
}
