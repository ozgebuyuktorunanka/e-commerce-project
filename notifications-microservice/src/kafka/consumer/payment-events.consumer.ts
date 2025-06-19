import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../consumer.service';

@Injectable()
export class PaymentEventsConsumer implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['payment-topic'] },
      {
        eachMessage: async ({ message }) => {
          const value = message.value?.toString();
          if (value) {
            const parsed = JSON.parse(value);
            console.log('[PAYMENT EVENT]', parsed);
          }
        },
      }
    );
  }
}
