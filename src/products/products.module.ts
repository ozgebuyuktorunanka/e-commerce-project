import { Module } from '@nestjs/common';
import { UsersModule } from 'users/users.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    UsersModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule { }
