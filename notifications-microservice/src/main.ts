import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { KafkaOptions, MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationsAppModule } from './app.module'; // Güncellenmiş import
import logger from '../../libs/src/logger/winston-logger';



async function bootstrap() {
  try {
    const app = await NestFactory.create(NotificationsAppModule);
    const configService = app.get(ConfigService);

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    const port1= Number(process.env.API_GATEWAY_PORT);
    // CORS ayarları
    app.enableCors({
      origin: [`http://localhost:${port1}`], // API Gateway
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    });

    // Kafka configuration
    const clientId = configService.get<string>('KAFKA_CLIENT_ID') || 'notifications-service';
    const brokers = configService.get<string>('KAFKA_BROKER')?.split(',') || ['localhost:9092'];
    const groupId = configService.get<string>('KAFKA_CONSUMER_GROUP_ID') || 'notifications-group';

    const kafkaOptions: KafkaOptions = {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId,
          brokers,
          retry: {
            retries: 3,
            initialRetryTime: 300,
            maxRetryTime: 30000,
          },
        },
        consumer: {
          groupId: `${groupId}-notification`,
          allowAutoTopicCreation: true,
        },
      },
    };

    app.connectMicroservice<MicroserviceOptions>(kafkaOptions);
    await app.startAllMicroservices();

    const port = Number(process.env.NOTIFICATION_SERVICE_PORT) || 3006;

    // Health check
    app.getHttpAdapter().get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'OK', 
        service: 'notifications',
        timestamp: new Date().toISOString(),
        port: port,
        kafka: { clientId, groupId: `${groupId}-notification`, brokers }
      });
    });

    await app.listen(port);
    logger.info(`🚀 Notifications service running on port ${port}`);

  } catch (error) {
    logger.error('❌ Error starting notifications service:', error);
    process.exit(1);
  }
}

bootstrap();