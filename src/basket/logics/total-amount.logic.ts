import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffees } from '../../products/coffees/entities/coffees.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LineItem } from '../entities/line-item.entity';

@Injectable()
export class TotalAmountLogic {
  constructor(
    @InjectRepository(Coffees)
    private readonly coffeesRepository: Repository<Coffees>,
  ) {}

async calculateTotalAmount(lineItems: LineItem[]): Promise<number> {
    let totalAmount = 0;
    for (const lineItem of lineItems) {

      const coffee = await this.coffeesRepository.findOneBy({ coffee_id: lineItem.product_id });

      if (!coffee) {
        throw new NotFoundException(`${lineItem.product_id} id degerine sahip olan kahve bulunamadi.`);
      }

      totalAmount += coffee.price * lineItem.quantity;
      console.log('totalAmount', totalAmount);
    }
    return totalAmount;
  }
}
