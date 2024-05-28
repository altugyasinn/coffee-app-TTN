import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { Coffees } from './entities/coffees.entity';

// it tells NestJS that this is a module
@Module({
  imports: [TypeOrmModule.forFeature([Coffees])],
  controllers: [CoffeesController],
  providers: [CoffeesService],
})
export class CoffeesModule {}