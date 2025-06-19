import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { BaseEntity } from '../../entities/baseEntity';
import { User } from '../../usersService/entities/user.entity';
import { Product } from '../../productsService/entities/product.entity';


export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  SHIPPED = 'SHIPPED',
}

@Entity('orders')
export class Order extends BaseEntity {
  @ManyToOne(() => User, { eager: false })
  user!: User;

  @ManyToMany(() => Product, { eager: false })
  @JoinTable({
    name: 'order_products',
    joinColumn: { name: 'order_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  products!: Product[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems!: OrderItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @Column('text',{ nullable: true })
  shippingAddress!: string;

  @Column('text', { nullable: true })
  notes?: string;
  
  constructor(dto: Partial<Order>) {
    super();
    Object.assign(this, { ...dto });
  }
}
