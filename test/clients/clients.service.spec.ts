import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { ClientsService } from '../../src/clients/clients.service';
import { ClientsRepository } from '../../src/clients/clients.repository';
import { ClientEntity } from '../../src/clients/entities/client.entity';
import { ClientRequest } from '../../src/clients/dto/client.request';
import { UpdateClientRequest } from '../../src/clients/dto/update-client.request';

describe('ClientsService', () => {
  let service;
  let repository;
  let logger;

  const mockClient: ClientEntity = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    isDeleted: false,
  };

  const mockClientsRepository = {
    getAllActives: jest.fn(),
    getOneActiveById: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    findOneByEmail: jest.fn(),
  };

  const mockLogger = {
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        { provide: ClientsRepository, useValue: mockClientsRepository },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    repository = module.get<ClientsRepository>(ClientsRepository);
    logger = module.get<Logger>(Logger);
  });

  describe('getAllActives', () => {
    it('should return all active clients', async () => {
      mockClientsRepository.getAllActives.mockResolvedValue([mockClient]);
      const result = await service.getAllActives();
      expect(result).toEqual([mockClient]);
    });
  });

  describe('getOneActiveById', () => {
    it('should return a client by id', async () => {
      mockClientsRepository.getOneActiveById.mockResolvedValue(mockClient);
      const result = await service.getOneActiveById(1);
      expect(result).toEqual(mockClient);
    });

    it('should throw NotFoundException if client not found', async () => {
      mockClientsRepository.getOneActiveById.mockResolvedValue(null);

      try {
        service.getOneActiveById(1);
      } catch (e) {
        expect(e.errorCode).toBe(404);
      }
    });
  });

  describe('deleteById', () => {
    it('should mark the client as deleted and save it', async () => {
      mockClientsRepository.getOneActiveById.mockResolvedValue(mockClient);
      await service.deleteById(1);
      expect(mockClient.isDeleted).toBe(true);
      expect(mockClientsRepository.save).toHaveBeenCalledWith(mockClient);
      expect(logger.debug).toHaveBeenCalledWith(
        `Client with id: 1 was deleted`,
      );
    });

    it('should throw NotFoundException if client not found', async () => {
      mockClientsRepository.getOneActiveById.mockResolvedValue(null);
      await expect(service.deleteById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const clientRequest: ClientRequest = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      mockClientsRepository.findOneByEmail.mockResolvedValue(null);
      mockClientsRepository.create.mockReturnValue(mockClient);
      mockClientsRepository.save.mockResolvedValue(mockClient);

      const result = await service.create(clientRequest);
      expect(result).toBe(mockClient.id);
      expect(mockClientsRepository.create).toHaveBeenCalledWith(clientRequest);
      expect(mockClientsRepository.save).toHaveBeenCalledWith(mockClient);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockClientsRepository.findOneByEmail.mockResolvedValue(mockClient);
      const clientRequest: ClientRequest = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      await expect(service.create(clientRequest)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing client', async () => {
      const updateRequest: UpdateClientRequest = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };
      mockClientsRepository.getOneActiveById.mockResolvedValue(mockClient);
      mockClientsRepository.findOneByEmail.mockResolvedValue(null);

      await service.update(1, updateRequest);
      expect(mockClientsRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateRequest),
      );
    });

    it('should throw NotFoundException if client not found', async () => {
      mockClientsRepository.getOneActiveById.mockResolvedValue(null);
      const updateRequest: UpdateClientRequest = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };

      await expect(service.update(1, updateRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      const updateRequest: UpdateClientRequest = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };
      mockClientsRepository.getOneActiveById.mockResolvedValue(mockClient);
      mockClientsRepository.findOneByEmail.mockResolvedValue(mockClient);

      await expect(service.update(1, updateRequest)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
