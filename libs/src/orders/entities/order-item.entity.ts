import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../productsService/entities/product.entity'

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  readonly product!: Product;

  @ManyToOne(() => Order, order => order.orderItems)
  @JoinColumn({ name: 'orderId' })
  readonly order!: Order;

  @Column({ type: 'integer' })
  readonly quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  readonly unitPrice!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  readonly totalPrice!: number;
}
