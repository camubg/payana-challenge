import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InvoiceItemRequest {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty()
  @IsInt({ message: 'Quantity must be an entire number' })
  @IsNotEmpty()
  @Min(1, { message: 'Quantity must be at least 1' })
  @Max(1000000000, { message: 'Quantity cannot exceed 1000000000' })
  quantity: number;
}
