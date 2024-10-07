import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRequest } from './dto/product.request';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  async getAllActives(): Promise<ProductEntity[]> {
    return this.repository.find({
      where: {
        isDeleted: false,
      },
    });
  }

  async getOneActiveById(id: number): Promise<ProductEntity> {
    return this.repository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  async save(product: ProductEntity): Promise<ProductEntity> {
    return this.repository.save(product);
  }

  create(createProductRequest: ProductRequest): ProductEntity {
    return this.repository.create(createProductRequest);
  }

  async findOneByName(name: string): Promise<ProductEntity> {
    return this.repository.findOne({
      where: { name },
    });
  }

  getAllByIds(ids: number[]) {
    return this.repository.find({
      where: {
        id: In(ids),
        isDeleted: false,
      },
    });
  }
}
