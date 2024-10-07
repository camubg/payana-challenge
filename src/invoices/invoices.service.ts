import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { ClientsService } from '../clients/clients.service';
import { InvoicesRepository } from './invoices.repository';
import { InvoiceRequest } from './dto/invoice.request';
import { InvoiceItemRequest } from './dto/invoice-item.request';
import { InvoiceItemsRepository } from './invoice-items.repository';
import { ProductEntity } from '../products/entities/product.entity';
import { InvoiceEntity } from './entities/invoice.entity';
import { ClientEntity } from '../clients/entities/client.entity';
import { InvoiceResponse } from './dto/invoice.response';
import { InvoiceItemEntity } from './entities/invoice-item.entity';
import { InvoiceItemResponse } from './dto/invoice-item.response';

export const MAX_TOTAL = 99999999.99;
@Injectable()
export class InvoicesService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly clientsService: ClientsService,
    private readonly invoicesRepository: InvoicesRepository,
    private readonly invoiceItemsRepository: InvoiceItemsRepository,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  async create(createInvoiceRequest: InvoiceRequest): Promise<InvoiceResponse> {
    const client = await this.validateClientAndGetIt(
      createInvoiceRequest.clientId,
    );
    const products = await this.validateProductsAndGetThem(
      createInvoiceRequest.items,
    );

    return this.invoicesRepository
      .getManager()
      .transaction(async (entityManager) => {
        const invoice = this.createInvoice(client);
        const savedInvoice = await entityManager.save(invoice);

        let total = 0;
        const savedItems = [];
        for (const item of createInvoiceRequest.items) {
          const product = products.get(item.productId);

          const newItem = this.invoiceItemsRepository.create(
            savedInvoice,
            product,
            item.quantity,
            product.price,
          );

          total += product.price * item.quantity;
          const savedItem = await entityManager.save(newItem);
          savedItems.push(savedItem);
        }

        savedInvoice.total = total;
        if (total > MAX_TOTAL) {
          throw new BadRequestException(
            `Total amount exceeds the maximum allowed value of ${MAX_TOTAL}`,
          );
        }
        await entityManager.save(savedInvoice);

        try {
          // Calling DIAN SERVICE...
          this.logger.log('Calling DIAN SERVICE...');
        } catch (e) {
          this.logger.error(
            `Failed to process the invoice with DIAN`,
            e.message,
          );
          throw new InternalServerErrorException(
            'Failed to process the invoice',
          );
        }

        return this.getResponse(savedInvoice, savedItems);
      });
  }

  private createInvoice(client: ClientEntity) {
    const invoice = new InvoiceEntity();
    invoice.client = client;
    invoice.total = 0;
    return invoice;
  }

  private async validateClientAndGetIt(
    clientId: number,
  ): Promise<ClientEntity> {
    const client = await this.clientsService.getOneActiveById(clientId);
    if (!client) {
      throw new NotFoundException('Client not found.');
    }
    return client;
  }

  private async validateProductsAndGetThem(
    items: InvoiceItemRequest[],
  ): Promise<Map<number, ProductEntity>> {
    const ids = items.map((item) => item.productId);
    const products = await this.productsService.getAllByIds(ids);
    const existingProductIds = new Set(products.map((product) => product.id));
    const missingIds = ids.filter(
      (productId) => !existingProductIds.has(productId),
    );

    if (missingIds.length > 0) {
      throw new NotFoundException(
        `Some products not found: ${missingIds.join(', ')}`,
      );
    }
    return new Map(products.map((product) => [product.id, product]));
  }

  private getResponse(
    savedInvoice: InvoiceEntity,
    savedItems?: InvoiceItemEntity[],
  ): InvoiceResponse {
    const response = new InvoiceResponse();
    response.clientId = savedInvoice.client.id;
    response.clientEmail = savedInvoice.client.email;
    response.clientName = savedInvoice.client.name;
    response.total = savedInvoice.total;
    response.createdAt = savedInvoice.createdAt;
    response.invoiceId = savedInvoice.id;
    const itemsToTransform = savedItems ?? savedInvoice.items;
    response.items = itemsToTransform.map((entity) => {
      const item = new InvoiceItemResponse();
      item.price = entity.price;
      item.productId = entity.product.id;
      item.productName = entity.product.name;
      item.quantity = entity.quantity;
      return item;
    });
    return response;
  }

  async getInvoiceById(id: number): Promise<InvoiceResponse> {
    const invoice = await this.invoicesRepository.getById(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with id: ${id} not found.`);
    }
    return this.getResponse(invoice);
  }
}
