import { Module } from '@nestjs/common';
import { UsersModule } from '../../../users-microservice/src/users.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../../libs/src/productsService/entities/product.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductComment, ProductCommentSchema } from '../../../libs/src/productsService/entities/product-comment.entity';
import { ProductCommentsController } from './product-comments.controller';
import { ProductCommentsService } from './product-comments.service';
import { ElasticsearchSyncService } from './elasticsearch/elasticsearch.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    MongooseModule.forFeature([
      { name: ProductComment.name, schema: ProductCommentSchema },
    ]),
    UsersModule,
  ],
  controllers: [ProductsController, ProductCommentsController],
  providers: [ProductsService, ProductCommentsService,ElasticsearchSyncService],
  exports: [ProductsService, ProductCommentsService],
})
export class ProductsModule {}



/**
 * some notes for me:
 * Key Points: 
 * Comments are stored in MongoDB (using Mongoose)
 * Products are stored in TypeORM (SQL database)
 */