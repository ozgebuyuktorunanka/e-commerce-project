import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderService } from 'orders/orders.service';
import { Repository } from 'typeorm';
import { Payment } from './entities/payments.entity';
import { CreatePaymentDo } from './dto/create-payment.dto';
import { PaymentStatus } from './types/payments.methods';
import { OrderStatus } from 'orders/entities/order.entity';
import { UpdatePaymentDto } from './dto/update-payment.dto';

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

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async findByOrder(orderId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { order: { id: orderId } },
    });
  }
  
  async create(createPaymentDto: CreatePaymentDo): Promise<Payment> {
    const order = await this.orderService.findOne(Number(createPaymentDto.orderId));

    const payment = this.paymentRepository.create({
      order,
      amount: createPaymentDto.amount,
      paymentMethod: createPaymentDto.paymentMethod,
    });

    return this.paymentRepository.save(payment);
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);
    
    if (updatePaymentDto.status) {
      payment.status = updatePaymentDto.status;
      
      // If payment is completed, update order status
      if (payment.status === PaymentStatus.COMPLETED) {
        await this.orderService.updateStatus(Number(payment.order.id), OrderStatus.PROCESSING);
      } else if (payment.status === PaymentStatus.REFUNDED) {
        await this.orderService.updateStatus(Number(payment.order.id), OrderStatus.CANCELLED);
      }
    }
    
    if (updatePaymentDto.transactionId) {
      payment.transactionId = updatePaymentDto.transactionId;
    }
    
    return this.paymentRepository.save(payment);
  }
  
  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentRepository.remove(payment);
  }

  async processPayment(id: string): Promise<Payment> {
    // This would normally include actual payment gateway integration
    const payment = await this.findOne(id);
    
    // Simulate payment processing
    const isSuccessful = Math.random() > 0.2; // 80% success rate for demo
    
    if (isSuccessful) {
      payment.status = PaymentStatus.COMPLETED;
      payment.transactionId = `TR-${Date.now()}`;
      await this.orderService.updateStatus(Number(payment.order.id), OrderStatus.PROCESSING);
    } else {
      payment.status = PaymentStatus.FAILED;
    }
    
    return this.paymentRepository.save(payment);
  }


}
