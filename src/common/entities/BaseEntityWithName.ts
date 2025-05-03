import { Column, Entity } from 'typeorm';
import { BaseEntity } from './baseEntity';

Entity('baseentitywithname');
export abstract class BaseEntityWithName extends BaseEntity {
  @Column({ type: 'varchar', length: 150, unique: false })
  name: string;

  @Column({ length: 1000, nullable: true })
  description?: string;
}