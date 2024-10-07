import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must have at most 2 decimal places' },
  )
  @IsOptional()
  @Min(0.01, { message: 'Price must be at least 0.01' })
  @Max(99999999.99, { message: 'Price cannot exceed 99999999.99' })
  price: number;
}
