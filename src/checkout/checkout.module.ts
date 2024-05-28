import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checkout } from './entities/checkout.entity';
import { Discount } from './entities/discount.entity';
import { Basket } from '../basket/entities/basket.entity';
import { DiscountLogic } from './logics/discount.logic';
import { CouponCheckLogic } from './logics/coupon-check.logic';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../error/http-exception.filter';

@Module({
  imports: [TypeOrmModule.forFeature([Checkout, Basket, Discount])],
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    Basket,
    Discount,
    DiscountLogic,
    CouponCheckLogic,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class CheckoutModule { }
