import { Injectable, BadRequestException, NotFoundException, HttpException, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Checkout } from './entities/checkout.entity';
import { Basket } from '.././basket/entities/basket.entity';
import { Discount } from './entities/discount.entity';


import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { CreateDiscountDto } from './dto/create-checkout.dto';

import { DiscountLogic } from './logics/discount.logic';
import { CouponCheckLogic } from './logics/coupon-check.logic';


import * as amqp from 'amqplib';
import { send } from 'process';


@Injectable()
export class CheckoutService {
  constructor(

    @InjectRepository(Checkout)
    private readonly checkoutRepository: Repository<Checkout>,
    @InjectRepository(Basket)
    private readonly basketRepository: Repository<Basket>,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    private readonly discountLogic: DiscountLogic,
    private readonly couponCheckLogic: CouponCheckLogic,
  ) { }

  async create(createCheckoutDto: CreateCheckoutDto) {
    try {
      const { basket_id } = createCheckoutDto;

      const basket = await this.basketRepository.findOne({ where: { basket_id } });
      if (!basket) {
        return new HttpException(`Basket with id ${basket_id} not found`, HttpStatus.BAD_REQUEST);
      }

      const checkout = new Checkout();

      checkout.basket_id = basket.basket_id;
      checkout.total_amount = basket.total_amount;
      checkout.email = createCheckoutDto.email;
      checkout.discount = [];
      checkout.amount_to_be_pay = 0;

      if (checkout.total_amount >= 3000) {
        checkout.amount_to_be_pay = this.discountLogic.applyDiscountOver3000(checkout.total_amount);

        const discount = await this.createDiscount(createCheckoutDto,
          'OVER-3000',
          '3000 TL uzeri alisverisinize %25 indirim uygulanmistir.',
          'computed',
          '25PERCENTDISCOUNT'
        );
        checkout.discount.push(discount);

        const coffeeDiscount = await this.createDiscount(createCheckoutDto,
          "COFFEE",
          "3000 TL uzeri alisverisinize 1 KG kahve hediye!",
          "computed",
          'FREE1KGCOFFEE'
        );
        checkout.discount.push(coffeeDiscount);

      }
      else if (checkout.total_amount >= 2000) {
        checkout.amount_to_be_pay = this.discountLogic.applyDiscountOver2000(checkout.total_amount);

        const discount = await this.createDiscount(createCheckoutDto,
          'OVER-2000',
          '2000 TL uzeri alisverisinize %20 indirim uygulanmistir.',
          'computed',
          '20PERCENTDISCOUNT'
        );
        checkout.discount.push(discount);

      }
      else if (checkout.total_amount >= 1500) {
        checkout.amount_to_be_pay = this.discountLogic.applyDiscountOver1500(checkout.total_amount);

        const discount = await this.createDiscount(createCheckoutDto,
          'OVER-1500',
          '1500 TL uzeri alisverisinize %15 indirim uygulanmistir.',
          'computed',
          '15PERCENTDISCOUNT'
        );
        checkout.discount.push(discount);

      }
      else if (checkout.total_amount >= 1000) {
        checkout.amount_to_be_pay = this.discountLogic.applyDiscountOver1000(checkout.total_amount);

        const discount = await this.createDiscount(createCheckoutDto,
          'OVER-1000',
          '1000 TL uzeri alisverisinize %10 indirim uygulanmistir.',
          'computed',
          '10PERCENTDISCOUNT'
        );
        checkout.discount.push(discount);

      }
      else {
        checkout.amount_to_be_pay = checkout.total_amount;
      }

      const couponCode = createCheckoutDto.discount?.[0]?.coupon_code;

      if (!(couponCode === undefined)) {

        if (!this.couponCheckLogic.isValidCouponCode(couponCode)) {
          return new HttpException("Invalid coupon code", HttpStatus.BAD_REQUEST);
        } else {
          checkout.amount_to_be_pay = this.discountLogic.applyDiscountCouponCode(checkout.amount_to_be_pay);
          const discount = await this.createDiscount(createCheckoutDto,
            'COUPON',
            'Tum indirimlere ek %10 indirim kupon kodu uygulanmistir.',
            'coupon',
            `${couponCode}`
          );
          checkout.discount.push(discount);
        }
      } else {
        console.log("couponCode is undefined")
      }

      if (!(checkout.amount_to_be_pay >= 500)) {
        ;
        checkout.amount_to_be_pay = Math.abs(checkout.amount_to_be_pay + 54.99);
        checkout.amount_to_be_pay = parseFloat(checkout.amount_to_be_pay.toFixed(2));
        checkout.amount_to_be_pay = Number(checkout.amount_to_be_pay);
      } else {
        checkout.amount_to_be_pay = checkout.amount_to_be_pay;

        const discount = await this.createDiscount(createCheckoutDto,
          "DELIVERY",
          "500 TL uzeri alisverisinize ucretsiz kargo!",
          "computed",
          'FREEDELIVERY'
        );
        checkout.discount.push(discount);

      }

      const savedCheckout = await this.checkoutRepository.save(checkout);

      createCheckoutDto.basket_id = savedCheckout.basket_id;
      createCheckoutDto.total_amount = savedCheckout.total_amount;
      createCheckoutDto.email = savedCheckout.email;
      createCheckoutDto.amount_to_be_pay = savedCheckout.amount_to_be_pay;
      createCheckoutDto.discount = savedCheckout.discount;

      const checkout_id = savedCheckout.checkout_id;

      // Olusturulan checkout verisini don ve yanında discount bilgilerini getir
      const checkoutWithDiscounts = await this.checkoutRepository.findOne({ where: { checkout_id }, relations: ["discount"] });
      this.sendEmailToQueue(createCheckoutDto);
      return checkoutWithDiscounts;

    } catch (error) {
      console.log("error", error)
    }

  }



  async createDiscount(createCheckoutDto: CreateCheckoutDto,
    discountName: string,
    description: string,
    discountType: string,
    couponCode: string
  ) {
    const discountDto = new CreateDiscountDto();
    discountDto.name = discountName;
    discountDto.description = description;
    discountDto.coupon_code = couponCode;
    discountDto.type = discountType;

    const discount = new Discount();
    discount.name = discountDto.name;
    discount.description = discountDto.description;
    discount.coupon_code = discountDto.coupon_code;
    discount.type = discountDto.type;

    return await this.discountRepository.save(discount);

  }

  private async connectToRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://rabbitmq:5672');
        const channel = await connection.createChannel();
        return { connection, channel };
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
    }
}

public async sendEmailToQueue(createCheckoutDto: CreateCheckoutDto) {
    const { connection, channel } = await this.connectToRabbitMQ();
    const email = createCheckoutDto.email;
    const queueName = 'emailQueue';

    try {
        await channel.assertQueue(queueName, { durable: false });
        channel.sendToQueue(queueName, Buffer.from(email));
        console.log(" [x] Sent email to %s", email);
    } catch (error) {
        console.error('Error sending email to queue:', error);
    } finally {
        await channel.close();
        await connection.close();
    }
}
}
