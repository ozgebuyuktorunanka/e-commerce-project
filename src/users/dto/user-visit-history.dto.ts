import { IsString, IsNotEmpty, IsOptional, IsDate, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserVisitHistoryDto {
  @ApiProperty({
    description: 'The ID of the product being visited',
    example: '507f1f77bcf86cd799439011'
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Optional rating for the product (1-5)',
    example: 4,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;
}

export class UserVisitHistoryResponseDto {
  @ApiProperty({
    description: 'The ID of the user who visited the product',
    example: '507f1f77bcf86cd799439011'
  })
  userId: string;

  @ApiProperty({
    description: 'The ID of the visited product',
    example: '507f1f77bcf86cd799439011'
  })
  productId: string;

  @ApiProperty({
    description: 'The timestamp when the product was visited',
    example: '2024-03-05T12:00:00Z'
  })
  visitedAt: Date;

  @ApiProperty({
    description: 'Optional rating given by the user',
    example: 4,
    required: false
  })
  rating?: number;
}

export class VisitHistoryQueryDto {
  @ApiProperty({
    description: 'Number of records to return',
    example: 10,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({
    description: 'Start date for filtering visits',
    example: '2024-03-01T00:00:00Z',
    required: false
  })
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @ApiProperty({
    description: 'End date for filtering visits',
    example: '2024-03-05T23:59:59Z',
    required: false
  })
  @IsOptional()
  @IsDate()
  endDate?: Date;
} 