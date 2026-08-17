import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ example: 'Wireless Gaming Headset', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'High-quality noise-canceling gaming headset',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'ACTIVE', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  image?: any;
}
