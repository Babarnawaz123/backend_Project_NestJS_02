import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class OrderItemDto {
  @ApiProperty({ example: '60d5ecb8b5c9c22b1c8e4111' })
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  quantity!: number;

  @ApiProperty({ example: 15.99 })
  @IsNotEmpty()
  @IsNumber()
  price!: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @ApiProperty({ example: 31.98 })
  @IsNotEmpty()
  @IsNumber()
  totalAmount!: number;
}
