import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../consumer.service';

@Injectable()
export class UserEventsConsumer implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['user-topic'] },
      {
        eachMessage: async ({ message }) => {
          const value = message.value?.toString();
          if (value) {
            const parsed = JSON.parse(value);
            console.log('[USER EVENT]', parsed);
          }
        },
      }
    );
  }
}