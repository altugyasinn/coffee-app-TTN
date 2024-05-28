import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Checkout } from "./checkout.entity";

@Entity()
export class Discount {
    @PrimaryGeneratedColumn()
    discount_id: number;

    @Column({ type: 'enum', enum: ['computed', 'coupon'] })
    type: string;

    @Column({ type: 'enum', enum: ['OVER-500','OVER-1000', 'OVER-1500', 'OVER-2000', 'OVER-3000', 'COUPON', 'DELIVERY', 'COFFEE' ] })
    name: string;

    @Column()
    description: string;

    @Column()
    coupon_code: string;

    @ManyToOne(() => Checkout, checkout => checkout.discount)
    checkout: Checkout;
} 