import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AtLeastOneField } from '../../utils/at-least-one-field.validator';

@AtLeastOneField(['name', 'price'], {
  message: 'At least one field (name or price) must be provided',
})
export class UpdateProductRequest {
  @ApiProperty({
    description: 'The name of the product',
    example: 'coca-cola',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'The price of the product',
    example: '10',
    minimum: 0.01,
    maximum: 99999999.99,
    required: false,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must have at most 2 decimal places' },
  )
  @IsOptional()
  @Min(0.01, { message: 'Price must be at least 0.01' })
  @Max(99999999.99, { message: 'Price cannot exceed 99999999.99' })
  price?: number;
}
