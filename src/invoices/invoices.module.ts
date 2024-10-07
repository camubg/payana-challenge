import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoiceItemEntity } from './entities/invoice-item.entity';
import { InvoiceItemsRepository } from './invoice-items.repository';
import { InvoicesRepository } from './invoices.repository';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { ProductsModule } from '../products/products.module';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceEntity, InvoiceItemEntity]),
    ProductsModule,
    ClientsModule,
  ],
  controllers: [InvoicesController],
  providers: [
    Logger,
    InvoicesService,
    InvoiceItemsRepository,
    InvoicesRepository,
  ],
  exports: [InvoicesService],
})
export class InvoicesModule {}
