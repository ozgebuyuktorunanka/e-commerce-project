import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ShippingModule } from './shipping.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ShippingModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'shipping',
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'shipping-consumer',
        },
      },
    },
  );
  await app.listen();
  console.log('Shipping microservice is listening to Kafka events...');
}

bootstrap();

