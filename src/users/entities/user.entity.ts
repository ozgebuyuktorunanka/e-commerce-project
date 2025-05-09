import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { Order } from 'orders/entities/order.entity';
import { UserRole } from './user.enum';
import { BaseEntityWithName } from 'common/entities/BaseEntityWithName';
import { IsStrongPassword } from 'common/decoraters/is-strong-password.decorator';

@Entity('users')
export class User extends BaseEntityWithName {
  @Column({type: 'varchar', length: 150, unique:false})
  email: string;

  @Column({type: 'varchar', length: 100, unique:false})
  @IsStrongPassword()
  password: string;

  @Column({ type:'boolean', default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({name: 'birthday', nullable: true, type: 'timestamp'})
  birthdate: string;

  @OneToMany(() => Order, (order) => order.user)
  orders?: Order[];

  constructor( userDTO: Partial<User>){
    super();
    Object.assign(this, {...userDTO});
  }
}

export { UserRole };
