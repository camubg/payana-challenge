import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'UniqueProductIds', async: false })
@Injectable()
export class UniqueProductIdsValidator implements ValidatorConstraintInterface {
  validate(items: any[], args: ValidationArguments) {
    const productIds = items.map((item) => item.productId);
    const uniqueProductIds = new Set(productIds);
    return uniqueProductIds.size === productIds.length;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Product IDs must be unique within the items array';
  }
}
