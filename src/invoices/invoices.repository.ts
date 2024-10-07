import {
  Between,
  EntityManager,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoiceFiltersDto } from './dto/invoice-filters.dto';

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

  async getAll(filters: InvoiceFiltersDto): Promise<InvoiceEntity[]> {
    let dateConditions: any = Not(IsNull());
    if (filters.fromDate) dateConditions = MoreThanOrEqual(filters.fromDate);
    if (filters.toDate) dateConditions = LessThanOrEqual(filters.toDate);
    if (filters.fromDate && filters.toDate)
      dateConditions = Between(filters.fromDate, filters.toDate);

    return this.repository.find({
      where: {
        createdAt: dateConditions,
      },
      relations: ['client', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }
}
