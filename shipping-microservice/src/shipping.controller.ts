import { Controller } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { OrderCreatedEvent } from '@common/events/order-created.event';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ShippingStatus } from './entities/shipping-status.enum';
import { ORDER_KAFKA_EVENTS } from '@common/types/types';
@Controller()

export class ShippingController {
    constructor(private readonly shippingService: ShippingService) {}
    @EventPattern(ORDER_KAFKA_EVENTS.ORDER_CREATED)
    handleOrderCreated(@Payload() orderCreatedEvent: OrderCreatedEvent) {
        console.log('Shipping:---------  ' + orderCreatedEvent.userId);
        this.shippingService.orderCreatedEventHandler(orderCreatedEvent);
    }
    @EventPattern(ORDER_KAFKA_EVENTS.ORDER_SHIPPING_CREATED)
    createShippingStateInfo(@Payload() orderCreatedEvent: OrderCreatedEvent) {
        console.log('Shipping Created:---------  ' + orderCreatedEvent);
    }
    @EventPattern(ORDER_KAFKA_EVENTS.ORDER_UPDATED)
    updateShippingState(@Payload() status: ShippingStatus, shippingId: number) {
        this.shippingService.updateShippingState(status, shippingId);
    }
}