import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderService } from 'orders/orders.service';
import { Repository } from 'typeorm';
import { Payment } from './entities/payments.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus }from '../payments/types/payments.methods';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { OrderStatus } from 'orders/entities/order.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private orderService: OrderService,
  ) {}

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id: id } });

    if (!payment) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return payment;
  }

  async findByOrder(orderId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { order: { id: orderId } },
    });
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const order = await this.orderService.findOne(
      Number(createPaymentDto.orderId),
    );

    const payment = this.paymentRepository.create({
      order,
      amount: createPaymentDto.amount,
      paymentMethod: createPaymentDto.paymentMethod,
    });

    return this.paymentRepository.save(payment);
  }

  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.findOne(id);

    if (updatePaymentDto.status) {
      payment.status = updatePaymentDto.status;

      // If payment is completed, update order status
      if (payment.status === PaymentStatus.COMPLETED) {
        await this.orderService.updateStatus(
          Number(payment.order.id),
          OrderStatus.PROCESSING,
        );
      } else if (payment.status === PaymentStatus.REFUNDED) {
        await this.orderService.updateStatus(
          Number(payment.order.id),
          OrderStatus.CANCELLED,
        );
      }
    }

    if (updatePaymentDto.transactionId) {
      payment.transactionId = updatePaymentDto.transactionId;
    }

    return this.paymentRepository.save(payment);
  }

  async remove(id: number): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentRepository.remove(payment);
  }

  async processPayment(id: number): Promise<Payment> {
    // This would normally include actual payment gateway integration
    const payment = await this.findOne(id);

    //🧠 Success Rate - This is a MAGIC NUMBER.
    const PAYMENT_SUCCESS_PROBABILITY = 0.8;

    // 🧠 Random achievement detection 
    const isSuccessful = this.simulatePaymentGatewayResponse(PAYMENT_SUCCESS_PROBABILITY);

    if (isSuccessful) {
      payment.status = PaymentStatus.COMPLETED;
      payment.transactionId = `TR-${Date.now()}`;
      await this.orderService.updateStatus(
        Number(payment.order.id),
        OrderStatus.PROCESSING,
      );
    } else {
      payment.status = PaymentStatus.FAILED;
    }

    return this.paymentRepository.save(payment);
  }

  //THESE TWO METHOD IS HELPER METHOD
  private simulatePaymentGatewayResponse(successProbability: number): boolean {
    return Math.random() < successProbability;
  }

  private generateTransactionId(): string {
    return `TR-${Date.now()}`;
  }
  
}
