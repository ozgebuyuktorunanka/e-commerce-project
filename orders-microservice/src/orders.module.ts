import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrderService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../libs/src/orders/entities/order.entity';
import { UsersModule } from '../../users-microservice/src/users.module';
import { ProductsModule } from '../../products-microservice/src/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    UsersModule,
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}