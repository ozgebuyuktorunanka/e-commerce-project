import { IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";


//Product entity definition
export class CreateProductDto {
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;

    //Decoraters
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    readonly price: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    readonly stock: number;
    readonly store_id:number;
    readonly category_id:number;
    readonly rating:number;
    readonly sell_count:number;

    @IsNotEmpty()
    @IsString()
    readonly imageUrl?: string; 
    readonly images: ImagesDto[];
}

export class ImagesDto{
    @IsString()
    url:string;

    @IsNotEmpty()
    @IsNumber()
    index:number;
}