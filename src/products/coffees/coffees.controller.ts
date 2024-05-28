import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';

import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Get()
  findAll() {
    return this.coffeesService.findAll();
  }

  // id degerini numeric deger tipine donusturmek icin ParseIntPipe kullanildi
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) coffee_id: number) {
    const coffee = this.coffeesService.findOne(coffee_id);

    if (!coffee) {
      throw new NotFoundException('Coffee does not exist!');
    }

    return coffee;
  }
  
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) coffee_id: number,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ) {
    return this.coffeesService.update(coffee_id, updateCoffeeDto);
  }
  
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) coffee_id: number) {
    return this.coffeesService.remove(coffee_id);
  }
}