import { NestFactory } from '@nestjs/core';
import { AuthModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule,
    {
      transport: Transport.TCP,
      options: {
        port: Number(process.env.AUTH_SERVICE_PORT || 3002),
      }
    }
  );
  await app.listen();
}

bootstrap();