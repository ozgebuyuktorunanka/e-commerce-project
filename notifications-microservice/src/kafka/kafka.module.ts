// kafka.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConsumerService } from './consumer.service';
import { OrderEventsConsumer } from './consumer/order-events.consumer';
import { PaymentEventsConsumer } from './consumer/payment-events.consumer';
import { UserEventsConsumer } from './consumer/user-events.consumer';

@Module({
  imports: [ConfigModule],
  providers: [
    ConsumerService,
    OrderEventsConsumer,
    PaymentEventsConsumer,
    UserEventsConsumer,
  ],
  exports: [ConsumerService],
})
export class KafkaModule {}
