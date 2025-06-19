import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../consumer.service';

@Injectable()
export class OrderEventsConsumer implements OnModuleInit {
  items: any;
  constructor(private readonly consumerService: ConsumerService) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['order-topic'] },
      {
        eachMessage: async ({ message }) => {
          const value = message.value?.toString();
          if (value) {
            const parsed = JSON.parse(value);
            console.log('[ORDER EVENT]', parsed);
          }
        },
      }
    );
  }
}
