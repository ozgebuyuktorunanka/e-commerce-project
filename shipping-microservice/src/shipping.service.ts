import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEventsConsumer } from '../../notifications-microservice/src/kafka/consumer/order-events.consumer';
import { RpcException } from '@nestjs/microservices';
import { Shipping } from './entities/shipping.entities';
import { ShippingStatus } from './entities/shipping-status.enum';

@Injectable()
export class ShippingService {
    constructor(
        @InjectRepository(Shipping)
        private readonly shippingRepository: Repository<Shipping>,
    ) { }
    async orderCreatedEventHandler(orderCreatedEvent: OrderEventsConsumer) {
        console.log('*******************************');
        console.log('******** SHIPPING CREATED ********');
        console.log('*******************************');
        console.log(orderCreatedEvent);

        const trackingNumber =
            'TRK-' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const shipping = this.shippingRepository.create({
            status: ShippingStatus.PENDING,
            productIds: orderCreatedEvent.items.map((p) => p.productId),
            address: 'UserId',
            trackingNumber: trackingNumber,
        });

        await this.shippingRepository.save(shipping);
        console.log('Shipping entity saved:', shipping);
    }

    async updateShippingState(state: ShippingStatus, shippingId: number) {
        const shipping = await this.shippingRepository.findOne({
            where: { id: shippingId },
        });

        if (!shipping) {
            throw new RpcException({
                statusCode: 404,
                message: ` ID ${shippingId} numaralı kargo bulunamadı.`
            })
            return;
        }

        shipping.status = state;

        await this.shippingRepository.save(shipping);

        console.log(`Shipping ID ${shippingId} status updated to ${state}`);
    }
}
