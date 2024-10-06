import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ProductEntity } from './dto/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductRequest } from './dto/create-product.request';

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

  create(createProductRequest: CreateProductRequest): ProductEntity {
    return this.repository.create(createProductRequest);
  }

  async findOneByName(name: string): Promise<ProductEntity> {
    return this.repository.findOne({
      where: { name },
    });
  }
}
