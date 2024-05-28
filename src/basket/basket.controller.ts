import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  NotFoundException, 
  ParseIntPipe 
} from '@nestjs/common';

import { BasketService } from './basket.service';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post()
  create(@Body() createBasketDto: CreateBasketDto) {
    return this.basketService.create(createBasketDto);
    
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) basket_id: number) {
    const basket = this.basketService.findOne(basket_id);
    return basket;
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) basket_id: number, 
    @Body() updateBasketDto: UpdateBasketDto) {
    return this.basketService.update(basket_id, updateBasketDto);
  } 

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) basket_id: number) {
    return this.basketService.remove(basket_id);
  }

  // @Delete(':id/:lineItemId')
  // removeLineItem(
  //   @Param('id', ParseIntPipe) basket_id: number, 
  //   @Param('lineItemId', ParseIntPipe) lineItem_id: number) {
  //   return this.basketService.removeLineItem(basket_id, lineItem_id);
  // } 
}
