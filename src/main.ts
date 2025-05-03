import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from 'common/filters/http-exception.filter';
import { TransformResponseInterceptor } from 'common/interceptors/transform-response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove properties not defined in the DTO
      forbidNonWhitelisted: true, // throw an error when properties not defined in the DTO are sent
      transform: true, // automatically convert DTOs to class objects
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  // CORS ayarları
  app.enableCors();
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  //Swagger docs creationg for API using with SwaggerModule and nestjs
  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('API for user management operations')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

