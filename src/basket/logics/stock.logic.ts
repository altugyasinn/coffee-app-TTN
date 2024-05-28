import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffees } from '../../products/coffees/entities/coffees.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StockLogic {
  constructor(
    @InjectRepository(Coffees)
    private readonly coffeesRepository: Repository<Coffees>,
  ) {}

  async checkStockAvailability(coffee_id: number, quantity: number): Promise<boolean> {
    const coffee = await this.coffeesRepository.findOneBy({ coffee_id });

    if (!coffee) {
      throw new NotFoundException('Urun bulunamadi. Lutfen gecerli bir urun id giriniz.');
    }
    return coffee.stock_quantity >= quantity;
  }
}