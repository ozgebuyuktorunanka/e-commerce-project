import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { ProductCommentsService } from './product-comments.service';
import { CreateProductCommentDto } from '@common/productsService/dto/product-comment.dto';

@Controller('products/:productId/comments')
export class ProductCommentsController {
  constructor(private readonly productCommentsService: ProductCommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req,
    @Param('productId') productId: string,
    @Body() createProductCommentDto: CreateProductCommentDto,
  ) {
    return this.productCommentsService.create(req.user.userId, {
      ...createProductCommentDto,
      productId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  delete(@Request() req, @Param('commentId') commentId: string) {

    //req.user.userId comes from JWT token
    return this.productCommentsService.delete(req.user.userId, commentId);
  }

  @Get()
  findByProductId(@Param('productId') productId: string) {
    return this.productCommentsService.findByProductId(productId);
  }

  //Anyone can view the average rating
  @Get('rating')
  getAverageRating(@Param('productId') productId: string) {
    return this.productCommentsService.calculateAverageRating(productId);
  }
} 

/**
 *  IMPORTANT NOTE: We can use this information while testing with postman.
 *   User can add comments to products :
   URL will be  -->   ${baseURL} POST /products/:productId/comments
   {
     "comment": "Great product!",
     "rating": 5
   }

   User can view comments:
  URL will be  -->   ${baseURL} GET /products/:productId/comments

   User can view average rating:
  URL will be  -->   ${baseURL} GET /products/:productId/comments/rating

  User can delete comments:
  URL will be  -->   ${baseURL} DELETE /products/:productId/comments/:commentId
 */