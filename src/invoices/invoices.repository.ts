import { Repository, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceEntity } from './entities/invoice.entity';

@Injectable()
export class InvoicesRepository {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly repository: Repository<InvoiceEntity>,
  ) {}

  getManager(): EntityManager {
    return this.repository.manager;
  }

  async getById(id: number): Promise<InvoiceEntity> {
    return this.repository.findOne({
      where: {
        id,
      },
      relations: ['client', 'items', 'items.product'],
    });
  }
}
