import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { LineItem } from './line-item.entity';

@Entity()
export class Basket {
  @PrimaryGeneratedColumn()
  basket_id: number;

  @Column({ type: 'enum', enum: ['COMPLETED', 'PENDING', 'CANCELLED'] })
  payment_status: string;

  @OneToMany(() => LineItem, lineItem => lineItem.basket)
  lineItems: LineItem[];

  @Column({ default: 1, type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;
}