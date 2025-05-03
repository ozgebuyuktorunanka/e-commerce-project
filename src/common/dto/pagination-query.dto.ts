import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationQueryDto {
  //Decoraters...
  @Type(() => Number)
  @IsOptional()
  @IsPositive({ message: 'Page number must be a positive number.' })
  @IsInt()
  @Min(1)
  readonly page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive({ message: 'The number of records per page must be a positive number.'})
  @Min(1, { message: 'The number of records per page must be at least 1' })
  @Max(100, { message: 'The number of records per page must be max 100.' })
  readonly limit: number;

  @IsOptional()
  @IsString({ message: 'Sort field must be a string.' })
  readonly sort: string = 'id';

  @IsOptional()
  @IsEnum(SortOrder)
  readonly order: SortOrder = SortOrder.ASC;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsPositive({ message: 'Offset must be a positive number.' })
  readonly offset?: number;
}

/**
 * Pagination:
 * Pagination is the process of dividing a large set of data into smaller "pages".
 * Instead of returning all records from a database at once.
 * (which could be thousands or millions of entries), pagination lets the client
 * fetch only a portion - for example, 10 or 20 records per request.
 */
