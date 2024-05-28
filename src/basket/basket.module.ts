import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Basket } from './entities/basket.entity';
import { LineItem } from './entities/line-item.entity';
import { Coffees } from '../products/coffees/entities/coffees.entity';

import { StockLogic } from './logics/stock.logic';
import { TotalAmountLogic } from './logics/total-amount.logic';

@Module({
  imports: [TypeOrmModule.forFeature([Basket, LineItem, Coffees])],
  controllers: [BasketController],
  providers: [BasketService, StockLogic, TotalAmountLogic, Coffees, LineItem],
})
export class BasketModule {}
