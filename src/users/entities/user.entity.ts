//User entity definition --> Database models
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Order } from 'orders/entities/order.entity';
import{ UserRole } from './user.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;
  
  @Column({ unique: true })
  email: string;
  
  @Column()
  password: string;
  
  @Column({ default: true })
  isActive: boolean;
  
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;
  
  @Column()
  birthdate: string;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
  
  @OneToMany(() => Order, (order) => order.user)
  orders?: Order[];
}

export { UserRole };
