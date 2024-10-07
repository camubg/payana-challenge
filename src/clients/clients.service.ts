import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ClientsRepository } from './clients.repository';
import { ClientEntity } from './entities/client.entity';
import { ClientRequest } from './dto/client.request';
import { UpdateClientRequest } from './dto/update-client.request';

@Injectable()
export class ClientsService {
  constructor(
    private readonly clientsRepository: ClientsRepository,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  async getAllActives(): Promise<ClientEntity[]> {
    const clientEntities = await this.clientsRepository.getAllActives();
    return plainToInstance(ClientEntity, clientEntities);
  }

  async getOneActiveById(id: number): Promise<ClientEntity> {
    const clientEntity = await this.clientsRepository.getOneActiveById(id);
    return plainToInstance(ClientEntity, clientEntity);
  }

  async deleteById(id: number): Promise<void> {
    const clientEntity = await this.clientsRepository.getOneActiveById(id);
    if (!clientEntity) {
      throw new NotFoundException('Client not found or already deleted.');
    }
    clientEntity.isDeleted = true;
    await this.clientsRepository.save(clientEntity);
    this.logger.debug(`Client with id: ${id} was deleted`);
  }

  async create(createClientRequest: ClientRequest): Promise<number> {
    await this.validateUniqueEmail(createClientRequest.email);

    const newClient = this.clientsRepository.create(createClientRequest);
    const client = await this.clientsRepository.save(newClient);
    return client.id;
  }

  private async validateUniqueEmail(email: string) {
    const existingClient = await this.clientsRepository.findOneByEmail(email);

    if (existingClient) {
      throw new ConflictException(
        'A client (active or delete) with this email already exists. Please choose another email.',
      );
    }
  }

  async update(
    id: number,
    updateClientRequest: UpdateClientRequest,
  ): Promise<void> {
    const client = await this.clientsRepository.getOneActiveById(id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    if (updateClientRequest.email)
      await this.validateUniqueEmail(updateClientRequest.email);

    Object.assign(client, updateClientRequest);
    await this.clientsRepository.save(client);
  }
}
