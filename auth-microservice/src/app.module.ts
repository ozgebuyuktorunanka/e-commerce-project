import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule} from '../../users-microservice/src/users.module';
import { Auth } from 'entities/auth.entity';
import { AuthService } from './app.service';
import { AuthController } from './app.controller';
import { JwtStrategy } from '../../users-microservice/src/strategies/jwt.strategy';
import { RolesGuard } from '@common/guards/roles.guard';
import {JwtAuthGuard} from '@common/guards/jwt-auth.guard';
@Module({
  imports: [
    ConfigModule,
    UsersModule,
    TypeOrmModule.forFeature([Auth]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }, //for 1 Day - JWT  validity period
      }),
    }),
  ],
  providers: [AuthService, JwtAuthGuard, RolesGuard, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
