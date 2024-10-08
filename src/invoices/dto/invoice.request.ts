import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  Validate,
  ValidateNested,
} from 'class-validator';
import { InvoiceItemRequest } from './invoice-item.request';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UniqueProductIdsValidator } from '../../utils/unique-products-ids.validator';

export class InvoiceRequest {
  @ApiProperty({
    description: 'The id of the client',
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  clientId: number;

  @ApiProperty({
    description: 'List of items included in the invoice',
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemRequest)
  @Validate(UniqueProductIdsValidator, {
    message: 'Product IDs must be unique within the items array',
  })
  items: InvoiceItemRequest[];
}
