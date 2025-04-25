import { IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";


//Product entity definition
export class CreateProductDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    //Decoraters
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    stock: number;
    store_id:number;
    category_id:number;
    rating:number;
    sell_count:number;

    @IsNotEmpty()
    @IsString()
    imageUrl?: string;

    images: ImagesDto[];
}

export class ImagesDto{
    @IsString()
    url:string;

    @IsNotEmpty()
    @IsNumber()
    index:number;
}