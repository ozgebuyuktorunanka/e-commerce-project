import { IsNotEmpty, IsNumber, IsPositive, IsString, Min, IsOptional, IsArray } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


//Product entity definition
export class CreateProductDto {
    @IsNotEmpty()
    @IsNumber()
    readonly id!: number;

    //Decoraters
    @ApiProperty({
        description: 'Product name',
        example: 'iPhone 13 Pro'
    })
    @IsNotEmpty()
    @IsString()
    readonly name!: string;

    @ApiProperty({
        description: 'Product description',
        example: 'Apple iPhone 13 Pro 256GB'
    })
    @IsNotEmpty()
    @IsString()
    readonly description!: string;

    @ApiProperty({
        description: 'Product price',
        example: 29999.99,
        minimum: 0
    })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    readonly price!: number;

    @ApiProperty({
        description: 'Product stock quantity',
        example: 100,
        minimum: 0
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    readonly stock!: number;
    readonly store_id!:number;
    readonly category_id!:number;
    readonly rating!:number;
    readonly sell_count!:number;

    @ApiProperty({
        description: 'Product category',
        example: 'Electronics',
        required: false
    })
    @IsString()
    @IsOptional()
    readonly category?: string;

    @ApiProperty({ 
        description: 'Product categories',
        example: ['electronics', 'phones'] 
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    readonly categories?: string[];

    @ApiProperty({ 
        description: 'Product image URL',
        example: 'https://example.com/image.jpg' 
    })
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    readonly imageUrl?: string; 
    readonly images!: ImagesDto[];
}

export class ImagesDto{
    @IsString()
    url!:string;

    @IsNotEmpty()
    @IsNumber()
    index!:number;
}