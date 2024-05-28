import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffees } from './entities/coffees.entity';


@Injectable()
export class CoffeesService {

  constructor(
    @InjectRepository(Coffees) private coffeesRepository: Repository<Coffees>,
  ) {}


  create(createCoffeeDto: CreateCoffeeDto) {

    const coffee = new Coffees();

    coffee.title = createCoffeeDto.title;
    coffee.category_id = createCoffeeDto.category_id;
    coffee.category_title = createCoffeeDto.category_title;
    coffee.description = createCoffeeDto.description;
    coffee.price = createCoffeeDto.price;
    coffee.stock_quantity = createCoffeeDto.stock_quantity;
    coffee.origin = createCoffeeDto.origin;
    coffee.roast_level = createCoffeeDto.roast_level;
    coffee.flavor_notes = createCoffeeDto.flavor_notes;

    return this.coffeesRepository.save(coffee);
  }


  findAll() {
    return this.coffeesRepository.find();
  }


  findOne(coffee_id: number) {
    return this.coffeesRepository.findOneBy({ coffee_id });
  }


  async update(coffee_id: number, updateCoffeeDto: UpdateCoffeeDto) {

    const coffeeById = await this.coffeesRepository.findOneBy({ coffee_id });

    coffeeById.title = updateCoffeeDto.title;
    coffeeById.category_id = updateCoffeeDto.category_id;
    coffeeById.category_title = updateCoffeeDto.category_title;
    coffeeById.description = updateCoffeeDto.description;
    coffeeById.price = updateCoffeeDto.price;
    coffeeById.stock_quantity = updateCoffeeDto.stock_quantity;
    coffeeById.origin = updateCoffeeDto.origin;
    coffeeById.roast_level = updateCoffeeDto.roast_level;
    coffeeById.flavor_notes = updateCoffeeDto.flavor_notes;
    
    return this.coffeesRepository.save(coffeeById);
  }

  
  remove(coffee_id: number) {
    return this.coffeesRepository.delete(coffee_id);
  }
}