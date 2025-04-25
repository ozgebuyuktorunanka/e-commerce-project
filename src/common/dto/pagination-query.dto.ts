import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export class PaginationQueryDto {
    //Decoraters.
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;

    @IsOptional()
    sort: string = 'id';

    @IsOptional()
    @IsEnum(SortOrder)
    order: SortOrder = SortOrder.ASC;
}

/**
 * Pagination: 
 * Pagination is the process of dividing a large set of dat ainto smaller "pages". 
 * Instead of returning all records from a database at once.
 * (which could be thousands or millions of entries), pagination lets the client 
 * fetch only a portion - for example, 10 or 20 records per request.
 */