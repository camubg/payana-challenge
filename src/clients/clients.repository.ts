import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';
import { ClientRequest } from './dto/client.request';

@Injectable()
export class ClientsRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly repository: Repository<ClientEntity>,
  ) {}

  async getAllActives(): Promise<ClientEntity[]> {
    return this.repository.find({
      where: {
        isDeleted: false,
      },
    });
  }

  async getOneActiveById(id: number): Promise<ClientEntity> {
    return this.repository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  async save(client: ClientEntity): Promise<ClientEntity> {
    return this.repository.save(client);
  }

  create(createClientRequest: ClientRequest): ClientEntity {
    return this.repository.create(createClientRequest);
  }

  async findOneByEmail(email: string): Promise<ClientEntity> {
    return this.repository.findOne({
      where: { email },
    });
  }
}
