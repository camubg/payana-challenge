import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ProductRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must have at most 2 decimal places' },
  )
  @IsNotEmpty()
  @Min(0.01, { message: 'Price must be at least 0.01' })
  @Max(99999999.99, { message: 'Price cannot exceed 99999999.99' })
  price: number;
}
