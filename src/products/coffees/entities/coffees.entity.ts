import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,  } from 'typeorm';
import { Products } from '../../entities/products.entity'

@Entity()
export class Coffees {

  @PrimaryGeneratedColumn()
  coffee_id: number;

  @Column()
  title: string; 

  @ManyToOne(type => Products, product => product.coffees)
  product: Products;

  @Column()
  category_id: number;

  @Column()
  category_title: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // price degerinin 10 basamakli ve 2 ondalikli olmasi gerektigini belirtir
  price: number;

  @Column()
  stock_quantity: number;

  @Column()
  origin: string;

  @Column()
  roast_level: string;

  @Column()
  flavor_notes: string;
  
}