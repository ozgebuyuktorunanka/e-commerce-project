import { Module } from '@nestjs/common/decorators';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from './cart/cart.module';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';


@Module({
  imports: [
    ProductsModule,
    UsersModule,
    AuthModule,
    OrderModule,
    PaymentsModule,
    CartModule,
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
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
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
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { 
  constructor(private configService: ConfigService) {}

  async onApplicationShutDown(){
    console.log('Closing application, terminating MongoDB connection...');
  }
}
