import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ProductEntity } from '../../src/products/entities/product.entity';
import { ProductsService } from '../../src/products/products.service';
import { ProductsRepository } from '../../src/products/products.repository';
import { UpdateProductRequest } from '../../src/products/dto/update-product.request';
import { ProductRequest } from '../../src/products/dto/product.request';
import { ProductResponse } from '../../src/products/dto/product.response';

describe('ProductsService', () => {
  let service;
  let repository;
  let logger;

  const mockProduct: ProductEntity = {
    id: 1,
    name: 'Test Product',
    price: 100,
    isDeleted: false,
  };

  const mockProductResponse: ProductResponse = {
    id: 1,
    name: 'Test Product',
    price: 100,
  } as ProductResponse;

  const mockProductsRepository = {
    getAllActives: jest.fn(),
    getOneActiveById: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    findOneByName: jest.fn(),
    getAllByIds: jest.fn(),
  };

  const mockLogger = {
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsRepository, useValue: mockProductsRepository },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get(ProductsRepository);
    logger = module.get(Logger);
  });

  describe('getAllActives', () => {
    it('should return all active products', async () => {
      mockProductsRepository.getAllActives.mockResolvedValue([mockProduct]);
      const result = await service.getAllActives();
      expect(result).toEqual([mockProductResponse]);
    });
  });

  describe('getOneActiveById', () => {
    it('should return a product by id', async () => {
      mockProductsRepository.getOneActiveById.mockResolvedValue(mockProduct);
      const result = await service.getOneActiveById(1);
      expect(result).toEqual(mockProductResponse);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductsRepository.getOneActiveById.mockResolvedValue(null);

      try {
        service.getOneActiveById(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('deleteById', () => {
    it('should mark the product as deleted and save it', async () => {
      mockProductsRepository.getOneActiveById.mockResolvedValue(mockProduct);
      await service.deleteById(1);
      expect(mockProduct.isDeleted).toBe(true);
      expect(mockProductsRepository.save).toHaveBeenCalledWith(mockProduct);
      expect(logger.debug).toHaveBeenCalledWith(
        `Product with id: 1 was deleted`,
      );
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductsRepository.getOneActiveById.mockResolvedValue(null);
      await expect(service.deleteById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const productRequest: ProductRequest = {
        name: 'Test Product',
        price: 100,
      };
      mockProductsRepository.findOneByName.mockResolvedValue(null);
      mockProductsRepository.create.mockReturnValue(mockProduct);
      mockProductsRepository.save.mockResolvedValue(mockProduct);

      const result = await service.create(productRequest);
      expect(result).toBe(mockProduct.id);
      expect(mockProductsRepository.create).toHaveBeenCalledWith(
        productRequest,
      );
      expect(mockProductsRepository.save).toHaveBeenCalledWith(mockProduct);
    });

    it('should throw ConflictException if product name already exists', async () => {
      mockProductsRepository.findOneByName.mockResolvedValue(mockProduct);
      const productRequest: ProductRequest = {
        name: 'Test Product',
        price: 100,
      };

      await expect(service.create(productRequest)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const updateRequest: UpdateProductRequest = {
        name: 'Updated Product',
        price: 120,
      };
      mockProductsRepository.getOneActiveById.mockResolvedValue(mockProduct);
      mockProductsRepository.findOneByName.mockResolvedValue(null);

      await service.update(1, updateRequest);
      expect(mockProductsRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateRequest),
      );
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductsRepository.getOneActiveById.mockResolvedValue(null);
      const updateRequest: UpdateProductRequest = {
        name: 'Updated Product',
        price: 120,
      };

      await expect(service.update(1, updateRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if product name already exists', async () => {
      const updateRequest: UpdateProductRequest = {
        name: 'Updated Product',
        price: 120,
      };
      mockProductsRepository.getOneActiveById.mockResolvedValue(mockProduct);
      mockProductsRepository.findOneByName.mockResolvedValue(mockProduct);

      await expect(service.update(1, updateRequest)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getAllByIds', () => {
    it('should return all products by given ids', async () => {
      const ids = [1, 2, 3];
      mockProductsRepository.getAllByIds.mockResolvedValue([mockProduct]);

      const result = await service.getAllByIds(ids);
      expect(result).toEqual([mockProduct]);
      expect(mockProductsRepository.getAllByIds).toHaveBeenCalledWith(ids);
    });
  });
});
