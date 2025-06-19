import { Module } from '@nestjs/common/decorators';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule} from '../../products-microservice/src/app.module';  
import { AuthModule } from '../../auth-microservice/src/app.module';
import { OrdersModule } from '../../orders-microservice/src/app.module';
import { CartsModule } from '../../cart-microservice/src/app.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { join } from 'path';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ProductsModule,
    AuthModule,
    OrdersModule,
    CartsModule,
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),

    // TypeORM  for postgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: config.get<boolean>('DB_SYNC', false),
        entities: [
          join(__dirname, '..', 'common', 'users', 'entities', '*.entity{.ts,.js}'),
        ],
      }),
    }),
    //MongoDB Configurations
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('MongoDB connected succesfully.');
          });
          connection.on('disconnected', () => {
            console.log('MongoDB disconnected.');
          });

          connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
          });

          return connection;
        },
        connectionErrorFactory: (error) => {
          console.error('Failed to connect to MongoDB.', error);
          return error;
        },
      }),
    })
  ],
  controllers: [UsersController],
  providers: [UsersService],
})

export class UsersModule { 
  constructor(private configService: ConfigService) {}

  async onApplicationShutDown(){
    console.log('Closing application, terminating MongoDB connection...');
  }
}
