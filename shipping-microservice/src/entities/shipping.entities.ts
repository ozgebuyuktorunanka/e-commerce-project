import { BaseEntity } from '@common/entities/baseEntity';
import { Column, Entity } from 'typeorm';
import { ShippingStatus } from './shipping-status.enum';

@Entity()
export class Shipping extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ShippingStatus,
    default: ShippingStatus.PENDING,
  })
  status: ShippingStatus;
  @Column("simple-array")
  productIds: number[];

  @Column({ nullable: true })
  trackingNumber: string;

  @Column({ nullable: true })
  address: string;
}
