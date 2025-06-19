import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ProductsModule } from './products.module';
import logger from '../../libs/src/logger/winston-logger';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);

  // Global validation pipe - DTO validasyonları için
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // DTO'da olmayan alanları filtreler
    forbidNonWhitelisted: true, // Geçersiz alanlar için hata fırlatır
    transform: true, // String'leri number'a çevirir vs.
  }));

  // CORS ayarları - API Gateway'den gelen istekler için
  app.enableCors({
    origin: ['http://localhost:3000'], // API Gateway URL'i
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Port environment variable'dan al
  const port = Number(process.env.PRODUCT_SERVICE_PORT) || 3005;

  // Health check endpoint - Docker healthcheck için
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      service: 'products',
      timestamp: new Date().toISOString(),
      port: port
    });
  });

  await app.listen(port);
  logger.info(`🚀 Products service running on port ${port}`);
  logger.info(`🏥 Health check available at http://localhost:${port}/health`);
}

bootstrap().catch((error) => {
  logger.error('❌ Error starting products service:', error);
  process.exit(1);
});