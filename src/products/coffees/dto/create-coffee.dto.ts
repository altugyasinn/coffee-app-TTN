import { IsString, IsNumber, IsNotEmpty } from 'class-validator';


export class CreateCoffeeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  category_id: number;

  @IsString()
  @IsNotEmpty()
  category_title: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  stock_quantity: number;

  @IsString()
  origin: string;

  @IsString()
  roast_level: string;

  @IsString()
  flavor_notes: string;
}