
//Product entity definition
export class Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    store_id:number;
    category_id:number;
    rating:number;
    sell_count:number;
    imageUrl?: string;
    images: Images[];
    createdAt?:Date;
    updatedAt?:Date;
}

export class Images{
    url:string;
    index:number;
}