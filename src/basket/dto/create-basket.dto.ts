import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { isGeneratorObject } from 'util/types';

export class CreateBasketDto {
  @IsString()
  payment_status: string;

  @IsNotEmpty()
  lineItems: LineItemDto[];

  @IsNumber()
  @IsOptional()
  total_amount: number;
}
  
export class LineItemDto {
  
  @IsNumber()
  @IsOptional()
  lineItem_id: number;

  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;


}
  