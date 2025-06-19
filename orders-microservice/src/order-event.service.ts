import { Inject, Injectable } from '@nestjs/common';
import { KAFKA_SERVICE } from  '../../libs/src/constants/index';
import { ClientKafka } from '@nestjs/microservices';
import { OrderCreatedEvent } from 'events/order-created.event';
import logger from '@common/logger/winston-logger';
import { OrderPaidEvent } from 'events/order-paid.event';

// This service handles publishing order-related events to a Kafka message broker. 
// It connects to the Kafka client on module initialization and provides methods 
// to publish 'order_created' and 'order_paid' events, logging each event upon publication.

@Injectable()
export class OrderEventsService {
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async publishOrderCreated(event: OrderCreatedEvent): Promise<void> {
    await this.kafkaClient.emit('order_created', event);
    logger.info(`Order created event published: ${event.orderId}`);
  }

  async publishOrderPaid(event: OrderPaidEvent): Promise<void> {
    await this.kafkaClient.emit('order_paid', event);
    logger.info(`Order paid event published: ${event.orderId}`);
  }
}
