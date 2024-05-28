import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Basket } from './entities/basket.entity';
import { LineItem } from './entities/line-item.entity';
import { Coffees } from '../products/coffees/entities/coffees.entity';

import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';

import { StockLogic } from './logics/stock.logic'; 
import { TotalAmountLogic } from './logics/total-amount.logic';


@Injectable()
export class BasketService {
  constructor(

    @InjectRepository(Basket) private basketRepository: Repository<Basket>,
    @InjectRepository(LineItem) private lineItemRepository: Repository<LineItem>,
    @InjectRepository(Coffees) private coffeesRepository: Repository<Coffees>,

    private readonly stockLogic: StockLogic, 
    private readonly totalAmountLogic: TotalAmountLogic, 
  ) {}

  async create(createBasketDto: CreateBasketDto) {
    const basket = new Basket();

    basket.payment_status = createBasketDto.payment_status;
    basket.lineItems = []; 

    try {
    if (Array.isArray(createBasketDto.lineItems) && createBasketDto.lineItems.length > 0) {
        for (const lineItemDto of createBasketDto.lineItems) {
            if (lineItemDto.quantity === 0) {
                throw new BadRequestException('Urun adedi 0 olamaz. Lutfen gecerli bir urun adedi giriniz.');
            }
            
            // Stok kontrolu yapilir
            const stockAvailable = await this.stockLogic.checkStockAvailability(lineItemDto.product_id, lineItemDto.quantity);
            if (!stockAvailable) {
              throw new BadRequestException('Bu urun icin yeterli stok bulunmamakta. Lutfen gecerli bir urun adedi giriniz.');
            }

            const lineItem = new LineItem();
            lineItem.product_id = lineItemDto.product_id;
            lineItem.quantity = lineItemDto.quantity;

            await this.lineItemRepository.save(lineItem); 

            basket.lineItems.push(lineItem); 
        }
    }
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    try {
    
    basket.total_amount = await this.totalAmountLogic.calculateTotalAmount(basket.lineItems);
    createBasketDto.total_amount = basket.total_amount;
    return this.basketRepository.save(basket); 
    
} catch (error) {
  throw new BadRequestException(error.message);
}
}

  async findOne(basket_id: number) {
    const basket = await this.basketRepository.findOne({ where: { basket_id }, relations: ["lineItems"] });

    if (!basket) {
      throw new NotFoundException('Aradiginiz sepet bulunamadi. Lutfen gecerli bir sepet id giriniz.');
    }
    
    if (!basket.lineItems || basket.lineItems.length === 0) {
      console.log("Sepet icindeki urunler bulunamadi.");
    }
  
    return basket;
  }

  // hata olabilir kontrol et //////////////////////////////////////////
  async update(basket_id: number, updateBasketDto: UpdateBasketDto) {
    const basket = await this.basketRepository.findOne({ where: { basket_id }, relations: ["lineItems"] });
    if (!basket) {
        throw new NotFoundException(`${basket_id} id degerine sahip olan sepet bulunamadi. Lutfen gecerli bir sepet id giriniz.`);
    }
    
    if (!basket.lineItems || basket.lineItems.length === 0) {
        throw new NotFoundException(`${basket_id} id degerine sahip olan sepet icinde urun bulunamadi. Lutfen gecerli bir sepet id giriniz.`);
    }

    
    for (const lineItemDto of updateBasketDto.lineItems) {
        const lineItemToUpdate = basket.lineItems.find(item => item.lineItem_id === lineItemDto.lineItem_id);

        if (lineItemToUpdate) {
            lineItemToUpdate.product_id = lineItemDto.product_id;
            lineItemToUpdate.quantity = lineItemDto.quantity;

            const stockAvailable = await this.stockLogic.checkStockAvailability(lineItemDto.product_id, lineItemDto.quantity);
            if (!stockAvailable) {
              throw new BadRequestException('Bu urun icin yeterli stok bulunmamakta. Lutfen daha dusuk degerde bir urun adedi giriniz.');
            }

            if (lineItemToUpdate.quantity === 0) {
                await this.lineItemRepository.remove(lineItemToUpdate);
                // Kaldırılan line item'i sepetten de çıkarilir
                basket.lineItems = basket.lineItems.filter(item => item !== lineItemToUpdate);
            }
        }
    }
     basket.total_amount = await this.totalAmountLogic.calculateTotalAmount(basket.lineItems);
     updateBasketDto.total_amount = basket.total_amount;
    
    return this.basketRepository.save(basket);
}

async remove(basket_id: number) {
  const basket = await this.basketRepository.findOne({ where: { basket_id }, relations: ["lineItems"] });
  if (!basket) {
    throw new Error('Sepet bulunamadi. Lutfen gecerli bir sepet id giriniz.');
  }
  // İlgili sepetteki urunler silinir (db hatasi onlenir)
  await this.lineItemRepository.remove(basket.lineItems);

  // Sepet silinir
  await this.basketRepository.remove(basket);

  return `${basket_id} id degerine sahip olan sepet basariyla silindi.`;
}

}
