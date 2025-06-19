import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import logger from '@common/logger/winston-logger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: Number(process.env.CART_SERVICE_PORT || 3004),
      }
    }
  );
  await app.listen();
  logger.info("Carts microservice is listening...");
}
