// This code defines a Mongoose schema for a shopping cart in a NestJS application.
// It includes two classes: CartItem, which represents individual items in the cart,
// and Cart, which represents the entire cart associated with a specific user.
// The CartItem class contains properties for product ID, quantity, and price,
// while the Cart class includes the user ID and an array of CartItem objects.
// Both schemas are configured to include timestamps for creation and updates.

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CartDocument = Cart & Document; //Document is a type that represents a MongoDB document.

//This class defines an individual item in the shopping cart.

class CartItem {
  //Each property is decorated with @Prop(), which tells Mongoose to treat it as a field in the MongoDB document.
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId }) //MongooseSchema provides access to Mongoose's schema types.
  productId: MongooseSchema.Types.ObjectId;
  @Prop({ required: true, min: 1 })
  quantity: number;
  @Prop({ required: true, min: 0 })
  price: number;
}
const CartItemSchema = SchemaFactory.createForClass(CartItem);

export class Cart {
  @Prop({ required: true, unique: true })
  userId: MongooseSchema.Types.ObjectId;
  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];  // It defaults to an empty array if no items are present.
}
export const CartSchema = SchemaFactory.createForClass(Cart);
