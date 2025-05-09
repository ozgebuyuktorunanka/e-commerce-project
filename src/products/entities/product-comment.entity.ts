import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ProductComment extends Document {
  @Prop({ required: true, index: true })
  userId: string; //Who wrote the comment

  @Prop({ required: true, index: true })
  productId: string; //Which product the comment is for

  @Prop({ required: true })
  comment: string; //The actual comment text...

  @Prop({ required: true, min: 1, max: 5 })
  rating: number; // Rating will be between 1 and 5

  @Prop({ default: Date.now })
  createdAt: Date; //When the comment was created
}

export const ProductCommentSchema =
  SchemaFactory.createForClass(ProductComment);
