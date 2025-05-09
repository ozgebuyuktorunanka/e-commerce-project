import { Module } from '@nestjs/common';
import { UsersModule } from 'users/users.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductComment, ProductCommentSchema } from './entities/product-comment.entity';
import { ProductCommentsController } from './product-comments.controller';
import { ProductCommentsService } from './product-comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    MongooseModule.forFeature([
      { name: ProductComment.name, schema: ProductCommentSchema },
    ]),
    UsersModule,
  ],
  controllers: [ProductsController, ProductCommentsController],
  providers: [ProductsService, ProductCommentsService],
  exports: [ProductsService, ProductCommentsService],
})
export class ProductsModule {}



/**
 * some notes for me:
 * Key Points: 
 * Comments are stored in MongoDB (using Mongoose)
 * Products are stored in TypeORM (SQL database)
 */