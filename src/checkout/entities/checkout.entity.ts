import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Discount } from "./discount.entity";

@Entity()
export class Checkout {
    @PrimaryGeneratedColumn()
    checkout_id: number;

    @Column()
    basket_id: number;

    @Column()
    email: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_amount: number;

    @OneToMany(() => Discount, discount => discount.checkout)
    discount: Discount[];

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount_to_be_pay: number;

    

}