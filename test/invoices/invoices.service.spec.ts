import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ClientEntity } from '../../src/clients/entities/client.entity';
import { ProductEntity } from '../../src/products/entities/product.entity';
import { InvoiceEntity } from '../../src/invoices/entities/invoice.entity';
import { InvoiceRequest } from '../../src/invoices/dto/invoice.request';
import { InvoiceResponse } from '../../src/invoices/dto/invoice.response';
import {
  InvoicesService,
  MAX_TOTAL,
} from '../../src/invoices/invoices.service';
import { ProductsService } from '../../src/products/products.service';
import { ClientsService } from '../../src/clients/clients.service';
import { InvoicesRepository } from '../../src/invoices/invoices.repository';
import { InvoiceItemsRepository } from '../../src/invoices/invoice-items.repository';
import { InvoiceItemEntity } from '../../src/invoices/entities/invoice-item.entity';
import { InvoiceItemResponse } from '../../src/invoices/dto/invoice-item.response';
import { InvoiceFiltersDto } from '../../src/invoices/dto/invoice-filters.dto';

describe('InvoicesService', () => {
  let service;
  let productsService;
  let clientsService;
  let invoicesRepository;
  let invoiceItemsRepository;
  let logger;

  const mockClient: ClientEntity = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    isDeleted: false,
  };

  const mockProduct: ProductEntity = {
    id: 1,
    name: 'Test Product',
    price: 100,
    isDeleted: false,
  };

  const mockInvoiceEntity: InvoiceEntity = {
    id: 1,
    client: mockClient,
    total: 200,
    createdAt: new Date(),
    items: [],
  };

  const mockInvoiceItem: InvoiceItemEntity = {
    id: 1,
    invoice: mockInvoiceEntity,
    product: mockProduct,
    quantity: 2,
    price: 100,
  };

  const mockInvoiceRequest: InvoiceRequest = {
    clientId: 1,
    items: [{ productId: 1, quantity: 2 }],
  };

  const mockInvoiceResponse: InvoiceResponse = {
    clientId: mockClient.id,
    clientEmail: mockClient.email,
    clientName: mockClient.name,
    total: 200,
    createdAt: new Date(),
    invoiceId: 1,
    items: [
      {
        productId: mockProduct.id,
        productName: mockProduct.name,
        quantity: 2,
        price: 100,
      } as InvoiceItemResponse,
    ],
  };

  const mockInvoiceItemsRepository = {
    create: jest.fn(),
  };

  const mockEntityManager = {
    save: jest.fn(),
  };

  const mockLogger = {
    debug: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
  };

  const mockInvoiceRepository = {
    getManager: jest.fn(),
    getById: jest.fn(),
    getAll: jest.fn(),
  };

  const mockClientsService = {
    getOneActiveById: jest.fn(),
  };

  const mockProductsService = {
    getAllByIds: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        { provide: ProductsService, useValue: mockProductsService },
        { provide: ClientsService, useValue: mockClientsService },
        { provide: InvoicesRepository, useValue: mockInvoiceRepository },
        {
          provide: InvoiceItemsRepository,
          useValue: mockInvoiceItemsRepository,
        },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    productsService = module.get<ProductsService>(ProductsService);
    clientsService = module.get<ClientsService>(ClientsService);
    invoicesRepository = module.get<InvoicesRepository>(InvoicesRepository);
    invoiceItemsRepository = module.get<InvoiceItemsRepository>(
      InvoiceItemsRepository,
    );
    logger = module.get<Logger>(Logger);
  });

  describe('create', () => {
    it('should create a new invoice', async () => {
      invoicesRepository.getManager = jest.fn().mockReturnValue({
        transaction: jest
          .fn()
          .mockImplementation((callback) => callback(mockEntityManager)),
      });
      mockEntityManager.save.mockResolvedValueOnce(mockInvoiceEntity);
      mockEntityManager.save.mockResolvedValueOnce(mockInvoiceItem);
      clientsService.getOneActiveById = jest.fn().mockResolvedValue(mockClient);
      productsService.getAllByIds = jest.fn().mockResolvedValue([mockProduct]);
      invoiceItemsRepository.create = jest.fn().mockReturnValue({
        product: mockProduct,
        quantity: 2,
        price: mockProduct.price,
      });

      const result = await service.create(mockInvoiceRequest);

      expect(clientsService.getOneActiveById).toHaveBeenCalledWith(1);
      expect(productsService.getAllByIds).toHaveBeenCalledWith([1]);
      expect(invoiceItemsRepository.create).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining(mockInvoiceResponse));
    });

    it('should throw NotFoundException when client is not found', async () => {
      clientsService.getOneActiveById = jest.fn().mockResolvedValue(null);

      await expect(service.create(mockInvoiceRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when a product is not found', async () => {
      clientsService.getOneActiveById = jest.fn().mockResolvedValue(mockClient);
      productsService.getAllByIds = jest.fn().mockResolvedValue([]);

      await expect(service.create(mockInvoiceRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when total exceeds maximum allowed', async () => {
      const mockProductOverMax: ProductEntity = {
        ...mockProduct,
        price: MAX_TOTAL + 1,
      };

      productsService.getAllByIds = jest
        .fn()
        .mockResolvedValue([mockProductOverMax]);
      clientsService.getOneActiveById = jest.fn().mockResolvedValue(mockClient);

      const mockEntityManager = {
        save: jest.fn(),
      };
      mockEntityManager.save.mockResolvedValueOnce(mockInvoiceEntity);
      mockEntityManager.save.mockResolvedValueOnce({
        ...mockInvoiceItem,
        price: MAX_TOTAL + 1,
      });

      invoicesRepository.getManager = jest.fn().mockReturnValue({
        transaction: jest
          .fn()
          .mockImplementation((callback) => callback(mockEntityManager)),
      });

      invoiceItemsRepository.create = jest.fn().mockReturnValue({
        product: mockProductOverMax,
        quantity: 1,
        price: mockProductOverMax.price,
      });

      await expect(service.create(mockInvoiceRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException when DIAN service fails', async () => {
      const mockEntityManager = {
        save: jest.fn().mockResolvedValue(mockInvoiceEntity),
      };

      invoicesRepository.getManager = jest.fn().mockReturnValue({
        transaction: jest
          .fn()
          .mockImplementation((callback) => callback(mockEntityManager)),
      });

      clientsService.getOneActiveById = jest.fn().mockResolvedValue(mockClient);
      productsService.getAllByIds = jest.fn().mockResolvedValue([mockProduct]);
      invoiceItemsRepository.create = jest.fn().mockReturnValue({
        product: mockProduct,
        quantity: 2,
        price: mockProduct.price,
      });

      logger.log = jest.fn(() => {
        throw new Error('DIAN service failed');
      });

      await expect(service.create(mockInvoiceRequest)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getInvoiceById', () => {
    it('should return the invoice by id', async () => {
      invoicesRepository.getById = jest
        .fn()
        .mockResolvedValue(mockInvoiceEntity);

      const result = await service.getInvoiceById(1);
      expect(invoicesRepository.getById).toHaveBeenCalledWith(1);
      expect(result.invoiceId).toBe(1);
      expect(result.total).toBe(200);
    });

    it('should throw NotFoundException when invoice is not found', async () => {
      invoicesRepository.getById = jest.fn().mockResolvedValue(undefined);

      try {
        await service.getInvoiceById(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('getAll', () => {
    it('should return all the invoices', async () => {
      invoicesRepository.getAll = jest
        .fn()
        .mockResolvedValue([mockInvoiceEntity]);

      const result = await service.getAllInvoices(new InvoiceFiltersDto());
      expect(result.length).toBe(1);
      expect(result[0].invoiceId).toBe(1);
      expect(result[0].total).toBe(200);
    });
  });
});
