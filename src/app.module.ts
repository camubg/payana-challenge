import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as process from 'process';
import { ProductEntity } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';
import { ClientsModule } from './clients/clients.module';
import { ClientEntity } from './clients/entities/client.entity';
import { InvoiceEntity } from './invoices/entities/invoice.entity';
import { InvoiceItemEntity } from './invoices/entities/invoice-item.entity';
import { InvoicesModule } from './invoices/invoices.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USERNAME,
      entities: [ProductEntity, ClientEntity, InvoiceEntity, InvoiceItemEntity],
      database: process.env.DB_DATABASE,
      synchronize: true,
      logging: true,
    }),
    ProductsModule,
    ClientsModule,
    InvoicesModule,
  ],
  controllers: [AppController],
  providers: [Logger],
})
export class AppModule {}
