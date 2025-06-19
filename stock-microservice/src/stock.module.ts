import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
     ClientsModule.register([
      {
        name: 'PRODUCTS_MICROSERVICE',
        transport: Transport.TCP,
        options: {
          host: 'products-microservice', //docker eklenince
          port: 3024,
        },
      },
    ]),
  ],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
