import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceItemRequest } from './dto/invoice-item.request';
import { InvoiceItemEntity } from './entities/invoice-item.entity';
import { InvoiceEntity } from './entities/invoice.entity';
import { ProductEntity } from '../products/entities/product.entity';

@Injectable()
export class InvoiceItemsRepository {
  constructor(
    @InjectRepository(InvoiceItemEntity)
    private readonly repository: Repository<InvoiceItemEntity>,
  ) {}

  create(
    invoice: InvoiceEntity,
    product: ProductEntity,
    quantity: number,
    price: number,
  ): InvoiceItemEntity {
    return this.repository.create({
      invoice: invoice,
      product: product,
      quantity: quantity,
      price: price,
    });
  }
}
