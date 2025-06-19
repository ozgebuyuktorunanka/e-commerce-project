import { NestFactory } from '@nestjs/core';
import { RpcExceptionFilter } from '@common/filters/rpc-exception.filter';
import { ApiGatewayModule } from './apigateway.module';
import logger from '@common/logger/winston-logger';

//Apigateway PortNumber
const apiGatewayPort = Number(process.env.API_GATEWAY_PORT || 3000);

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  try {
    app.useGlobalFilters(new RpcExceptionFilter());
    await app.listen(apiGatewayPort);
    logger.info('Apigateway is running...');
  } catch (e) {
    logger.error('Control the apigateway service module. Error:', e);
  }
}

bootstrap();
