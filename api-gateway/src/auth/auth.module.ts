import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from  '@common/constants/index';

@Module({
  imports: [
    ClientsModule.register([
      {
        name:AUTH_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'auth-microservice',
          port: Number(process.env.AUTH_SERVICE_PORT),
        }
      }
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
