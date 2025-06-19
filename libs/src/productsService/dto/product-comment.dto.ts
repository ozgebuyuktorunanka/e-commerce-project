import { IsString, IsNumber, Min, Max, IsNotEmpty, IsInt } from 'class-validator';

export class CreateProductCommentDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsString()
  @IsNotEmpty()
  comment!: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;
}

export class UpdateProductCommentDto {
  @IsString()
  @IsNotEmpty()
  comment!: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;
} 