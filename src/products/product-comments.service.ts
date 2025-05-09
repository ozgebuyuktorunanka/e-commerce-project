import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductComment } from './entities/product-comment.entity';
import { CreateProductCommentDto, UpdateProductCommentDto } from './dto/product-comment.dto';

@Injectable()
export class ProductCommentsService {
  constructor(
    @InjectModel(ProductComment.name)
    private productCommentModel: Model<ProductComment>,
  ) {}

  async create(userId: string, createProductCommentDto: CreateProductCommentDto) {
    const comment = new this.productCommentModel({
      ...createProductCommentDto,
      userId,
    });
    return comment.save();
  }

  async delete(userId: string, commentId: string) {
    const comment = await this.productCommentModel.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    ///User can only delete their own comments :))
    if (comment.userId !== userId) {
      throw new UnauthorizedException('You can only delete your own comments');
    }
    return this.productCommentModel.findByIdAndDelete(commentId);
  }

  async findByProductId(productId: string) {
    //Comments are sorted by newest first
    return this.productCommentModel.find({ productId }).sort({ createdAt: -1 });
  }

  async calculateAverageRating(productId: string) {
    const result = await this.productCommentModel.aggregate([
      { $match: { productId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalComments: { $sum: 1 },
        },
      },
    ]);
    return result[0] || { averageRating: 0, totalComments: 0 };
  }
} 