 import { Controller } from '@nestjs/common';
 import { EventPattern, Payload } from '@nestjs/microservices';
 import { StockService } from './stock.service';
import { ORDER_KAFKA_EVENTS } from '../../libs/src/types/types';
import { OrderCreatedEvent } from '../../libs/src/events/order-created.event';

 @Controller()
 export class StockController {
  constructor(private readonly stockService: StockService) {}
  @EventPattern(ORDER_KAFKA_EVENTS.ORDER_CREATED)
  async handleOrderCreated(@Payload() orderCreatedEvent: OrderCreatedEvent) {
    await this.stockService.decreaseStock(orderCreatedEvent.items);
  }}