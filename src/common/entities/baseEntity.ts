import { timestamp } from "rxjs";
import { CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('baseentity')
export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' , type:'timestamp'})
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true ,type:'timestamp'})
    deletedAt?: Date;

}