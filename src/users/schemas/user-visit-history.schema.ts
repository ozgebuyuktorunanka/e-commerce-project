import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
})
export class UserVisitHistory extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, index: true })
  productId: string;

  @Prop({ required: true, type: Date, default: Date.now, index: true })
  visitedAt: Date;

  @Prop({ type: Number, min: 1, max: 5 })
  rating?: number;
}

export const UserVisitHistorySchema = SchemaFactory.createForClass(UserVisitHistory);

// Create compound indexes for efficient querying
UserVisitHistorySchema.index({ userId: 1, visitedAt: -1 });
UserVisitHistorySchema.index({ userId: 1, productId: 1, visitedAt: -1 });
UserVisitHistorySchema.index({ productId: 1, visitedAt: -1 }); 