import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { CART_SERVICE } from  '../../../libs/src/constants/index';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformResponseInterceptor } from '@common/interceptors/transform-response.interceptor';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: CART_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'users-microservice',
          port: Number(process.env.CART_SERVICE_PORT),
        },
      },
    ]),
  ],
  controllers: [CartsController],
  providers: [CartsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class CartsModule {}
