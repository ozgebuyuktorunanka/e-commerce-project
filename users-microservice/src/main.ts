import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersModule } from './users.module';
import logger from '@common/logger/winston-logger';

//Port Validation
const port = Number(process.env.USER_SERVICE_PORT);
if (!port || isNaN(port)) {
  logger.error('USER_SERVICE_PORT is not defined or invalid');
  process.exit(1);
}

async function bootstrap() {
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      UsersModule,
      {
        transport: Transport.TCP,
        options: {
          host: '0.0.0.0',
          port: port,
        }
      }
    );

    // Graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      await app.close();
      process.exit(0);
    });

    await app.listen();
    logger.info(`User Microservice is running on port ${process.env.USER_SERVICE_PORT}`);
  } catch (error) {
    logger.error('Failed to start User Microservice:', error);
    process.exit(1);
  }
}

bootstrap();
