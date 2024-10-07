import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InvoiceItemRequest {
  @ApiProperty({
    description: 'The id of the product',
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    description: 'The product`s quantity',
    example: '10',
    minimum: 1,
    maximum: 1000000000,
  })
  @IsInt({ message: 'Quantity must be an entire number' })
  @IsNotEmpty()
  @Min(1, { message: 'Quantity must be at least 1' })
  @Max(1000000000, { message: 'Quantity cannot exceed 1000000000' })
  quantity: number;
}
