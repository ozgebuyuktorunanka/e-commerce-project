import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AUTH_SERVICE,
  CART_SERVICE,
  ORDER_SERVICE,
  PRODUCT_SERVICE,
  USER_SERVICE,
} from '../../libs/src/constants/index';
import { AuthController } from './auth/auth.controller';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.TCP,
        options: { host: 'users-microservice', port: 4001 },
      },
      {
        name: AUTH_SERVICE,
        transport: Transport.TCP,
        options: { host: 'auth-microservice', port: 4002 },
      },
      {
        name: ORDER_SERVICE,
        transport: Transport.TCP,
        options: { host: 'order-microservice', port: 4003 },
      },
      {
        name: CART_SERVICE,
        transport: Transport.TCP,
        options: { host: 'cart-microservice', port: 4004 },
      },
      {
        name: PRODUCT_SERVICE,
        transport: Transport.TCP,
        options: { host: 'products-microservice', port: 4005 },
      },
    ]),
    CartsModule,
    OrdersModule,
    ProductsModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService],
})
export class ApiGatewayModule {}
