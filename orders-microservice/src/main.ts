
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { OrderModule } from './orders.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  
  // Validation pipe ekleyin
  app.useGlobalPipes(new ValidationPipe());
  
  // CORS ayarları
  app.enableCors();
  
  const port = process.env.ORDER_SERVICE_PORT || 3003;
  
  // Health check endpoint'i
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'orders' });
  });
  
  await app.listen(port);
  console.log(`Orders service running on port ${port}`);
}
bootstrap();