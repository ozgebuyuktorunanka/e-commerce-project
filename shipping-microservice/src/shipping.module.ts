
import { Module } from '@nestjs/common';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipping } from './entities/shipping.entities';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forFeature([Shipping]),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService], //DB BAĞLANTISI
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get<string>('SHIPPING_POSTGRES_HOST'),
                port: config.get<number>('SHIPPING_POSTGRES_PORT'),
                username: config.get<string>('SHIPPING_POSTGRES_USER'),
                password: config.get<string>('SHIPPING_POSTGRES_PASSWORD'),
                database: config.get<string>('SHIPPING_POSTGRES_DB'),
                synchronize: true,
                autoLoadEntities: true,
                logging: true,
                entities: [__dirname + '/**/entities/*.entity.ts'],
                cache: { duration: config.get<number>('TYPEORM_CACHE_DURATION') },
            }),
        }),
    ],
    controllers: [ShippingController],
    providers: [ShippingService],
})
export class ShippingModule { }
