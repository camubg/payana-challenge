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
import { UniqueProductIdsValidator } from './unique-products-ids.validator';

export class InvoiceRequest {
  @IsNumber()
  @IsNotEmpty()
  clientId: number;

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
