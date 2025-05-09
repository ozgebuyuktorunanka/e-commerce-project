import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartDocument } from './schema/cart.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { AddToCartDto, CartResponseDto, UpdateCartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>
    ) { }

    async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<CartResponseDto> {
        const { productId, quantity, price } = addToCartDto;

        //Find cart by userId or create new one if not found
        let cart = await this.cartModel.findOne({ userId: new MongooseSchema.Types.ObjectId(userId) });

        if (!cart) {
            cart = await this.cartModel.create({
                userId: new MongooseSchema.Types.ObjectId(userId),
                items: []
            });
        }

        const existingItemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId.toString(),
        );

        if (existingItemIndex > -1) {
            // If product already exists, just update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            //Add new item to cart
            cart.items.push({
                productId: new MongooseSchema.Types.ObjectId(productId.toString()),
                quantity,
                price,
            });
        }

        await cart.save();

        //Calculate total price
        const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return {
            message: 'Added to cart successfully',
            userId: cart.userId.toString(),
            items: cart.items.map(item => ({
                productId: item.productId.toString(),
                quantity: item.quantity,
                price: item.price
            })),
            totalPrice: total,
        };
    };

    async updateCart(userId: string, updateCartDto: UpdateCartDto): Promise<CartResponseDto> {
        const { productId, quantity } = updateCartDto;

        const cart = await this.cartModel.findOne({ userId });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId.toString(),
        );

        if (itemIndex === -1) {
            throw new NotFoundException('Item not found in cart');
        }


        if (itemIndex === 0) {
            //Remove item from cart if quantity is 0
            cart.items.splice(itemIndex, 1);
        } else {
            //Update quantity if item exists
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();

        //Calculate total price
        const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return {
            message: 'Updated cart successfully',
            userId: cart.userId.toString(),
            totalPrice: total,
            items: cart.items.map(item => ({
                productId: item.productId.toString(),
                quantity: item.quantity,
                price: item.price
            }))
        }
    };

    async getCart(userId: string): Promise<CartResponseDto> {
        const cart = await this.cartModel.findOne({ userId });

        if (!cart) {
            return {
                message: 'Cart not found',
                userId,
                items: [],
                totalPrice: 0,
            };
        }

        //Calculate total.
        const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

        return {
            message: 'Cart retrieved successfully',
            userId: cart.userId.toString(),
            totalPrice: total,
            items: cart.items.map(item => ({
                productId: item.productId.toString(),
                quantity: item.quantity,
                price: item.price
            }))
        };
    };

    async clearCart(userId: string): Promise<void> {
        const cart = await this.cartModel.findOne({ userId });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        cart.items = [];
        await cart.save();
    }

    async removeFromCart(userId: string, productId: string): Promise<CartResponseDto> {
        const cart = await this.cartModel.findOne({ userId });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId.toString());

        if (itemIndex === -1) {
            throw new NotFoundException('Item not found in cart');
        }

        //Remove item from cart :)
        cart.items.splice(itemIndex, 1);
        await cart.save();

        //Calculate total price
        const total = cart.items.reduce((sum, item) => sum - item.price * item.quantity, 0);

        return {
            message: 'Item removed from cart successfully',
            userId: cart.userId.toString(),
            totalPrice: total,
            items: cart.items.map(item => ({
                productId: item.productId.toString(),
                quantity: item.quantity,
                price: item.price
            }))
        }
    }
}
