import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Basket } from './basket.entity';

@Entity()
export class LineItem {
  @PrimaryGeneratedColumn()
  lineItem_id: number;

  @Column()
  product_id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Basket, basket => basket.lineItems)
  basket: Basket;
}