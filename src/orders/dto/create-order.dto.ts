import { IsArray, IsInt, IsNotEmpty, Min, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';

class OrderItemDto {
    @IsInt()
    @IsNotEmpty()
    food_id: number;
  
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    quantity: number;

    @IsInt()
    @Min(1)
    @IsNotEmpty()
    price: number;
}

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}
