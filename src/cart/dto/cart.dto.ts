// This TypeScript code defines Data Transfer Objects (DTOs) for managing a shopping cart in an e-commerce application. 
// The AddToCartDto class is used for adding items to the cart, including product ID, quantity, and price. 
// The UpdateCartDto class is for updating the quantity of a specific product in the cart. 
// The CartResponseDto class represents the response structure for a user's cart, including user ID, items, and total price. 
// Finally, the removeFromCartDto class is used to specify the product ID of an item to be removed from the cart.

import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Types } from 'mongoose';

export class AddToCartDto {
    @IsNotEmpty()
    productId: Types.ObjectId;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    message: string;
}

export class UpdateCartDto {
    message: string;

    @IsNotEmpty()
    productId: Types.ObjectId;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    quantity: number;
}

export class CartResponseDto {
    message: string;
    userId: string;
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    totalPrice: number;
}

export class removeFromCartDto {
    message: string;

    @IsNotEmpty()
    productId: Types.ObjectId;
}
