import { BaseEntity } from 'common/entities/baseEntity';
import { Order } from 'orders/entities/order.entity';
import { PaymentStatus, PaymentMethod } from 'payments/types/payments.methods';
import {Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Payment extends BaseEntity {
  @ManyToOne(() => Order, { eager: true })
  order: Order;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({ nullable: true })
  transactionId: string;
}
