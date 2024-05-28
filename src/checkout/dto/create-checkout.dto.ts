
import { IsNumber, IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateCheckoutDto {
  @IsNumber()
  @IsOptional()
  total_amount: number;

  @IsNotEmpty()
  @IsNumber()
  basket_id: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNumber()
  @IsOptional()
  amount_to_be_pay: number;

  @IsOptional()
  discount: CreateDiscountDto[];
}

export class CreateDiscountDto {
  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  coupon_code: string;

  @IsString()
  @IsOptional()
  description: string;

}
