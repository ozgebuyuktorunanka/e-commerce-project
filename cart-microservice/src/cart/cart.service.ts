import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { RpcException } from '@nestjs/microservices';
import { CreateCartDto } from '@common/dto/create-cart.dto';
import { UpdateCartDto } from '@common/dto/update-cart.dto'

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) { }
  async create(createCartDto: CreateCartDto) {
    const cart = await this.cartModel.findOne({ userId: createCartDto.userId });
    if (!cart) {
      //Creating a new bucket
      return this.cartModel.create({
        userId: createCartDto.userId,
        items: [
          {
            productId: createCartDto.productId,
            name: createCartDto.name,
            price: createCartDto.price,
            quantity: createCartDto.quantity,
          },
        ],
      });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === createCartDto.productId,
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += createCartDto.quantity;
    } else {
      cart.items.push({
        productId: createCartDto.productId,
        name: createCartDto.name,
        price: createCartDto.price,
        quantity: createCartDto.quantity,
      });
    }
    return cart.save();
  }

  async findAll() { }

  async findOne(id: number) {
    const cart = this.cartModel.findOne({ id });
    if (!cart) {
      throw new RpcException({
        statusCode: 404,
        message: `Cart is not found. Card Id:${id}`,
      });
    }
    return cart;
  }

  async update(updateCartDto: UpdateCartDto) {
    const cart = await this.cartModel.findOne({ userId: updateCartDto.userId });
    if (!cart) {
      throw new RpcException({
        statusCode: 404,
        message: `Cart is not found.Card Id:${updateCartDto.userId}`,
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === updateCartDto.productId,
    );

    if (itemIndex === -1) {
      throw new RpcException({
        statusCode: 404,
        message: `no card ranking found.: Index:${itemIndex}`,
      });
    }

    cart.items[itemIndex] = {
      productId: Number(updateCartDto.productId),
      name: cart.items[itemIndex].name,
      price: Number(updateCartDto.price),
      quantity: Number(updateCartDto.quantity),
    };

    return cart.save();
  }

  async remove(id: number) {
    const cart = await this.findOne(id);
    return this.cartModel.deleteOne({ id });
  }

  async removeCartProductItem(userId: number, productId: number) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      throw new RpcException({
        statusCode: 404,
        message: 'Cart Bulunamadı',
      });
    }
    const products = cart.items.filter((item) => item.productId !== productId);
    cart.items = products;
    return cart?.save();
  }
}
