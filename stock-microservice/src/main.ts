import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { StockModule } from './stock.module';
import logger from '@common/logger/winston-logger.js';

async function bootstrap() {
   const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    StockModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'stock',
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'stock-consumer',
        },
      },
    },
  );
  await app.listen();
  logger.info('Notification microservice is listening to Kafka events...');
}
bootstrap();
