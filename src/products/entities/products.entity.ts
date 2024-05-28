import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Coffees } from '../coffees/entities/coffees.entity';

@Entity()
export class Products {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  title: string;

  @OneToMany(type => Coffees, coffee => coffee.product)
  coffees: Coffees[];
}