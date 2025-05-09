import { BaseEntity } from 'common/entities/baseEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ length: 1000, nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'int' })
  store_id: number;

  @Column({ type: 'int' })
  category_id: number;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  sell_count: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ type: 'json', nullable: true })
  images: Images[];
}

export class Images {
  url: string;
  productId: number;
  index: number;
}
