import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { ProductResponse } from './dto/product.response';
import { plainToInstance } from 'class-transformer';
import { ProductRequest } from './dto/product.request';
import { UpdateProductRequest } from './dto/update-product.request';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  async getAllActives(): Promise<ProductResponse[]> {
    const productEntities = await this.productsRepository.getAllActives();
    return plainToInstance(ProductResponse, productEntities);
  }

  async getOneActiveById(id: number): Promise<ProductResponse> {
    const productEntity = await this.productsRepository.getOneActiveById(id);
    return plainToInstance(ProductResponse, productEntity);
  }

  async deleteById(id: number): Promise<void> {
    const product = await this.productsRepository.getOneActiveById(id);
    if (!product) {
      throw new NotFoundException('Product not found or already deleted.');
    }
    product.isDeleted = true;
    await this.productsRepository.save(product);
  }

  async create(createProductRequest: ProductRequest): Promise<number> {
    await this.validateUniqueName(createProductRequest.name);

    const newProduct = this.productsRepository.create(createProductRequest);
    const product = await this.productsRepository.save(newProduct);
    return product.id;
  }

  private async validateUniqueName(name: string) {
    const existingProduct = await this.productsRepository.findOneByName(name);

    if (existingProduct) {
      throw new ConflictException(
        'A product (active or delete) with this name already exists. Please choose another name.',
      );
    }
  }

  async update(
    id: number,
    updateProductRequest: UpdateProductRequest,
  ): Promise<void> {
    const product = await this.productsRepository.getOneActiveById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (updateProductRequest.name)
      await this.validateUniqueName(updateProductRequest.name);

    Object.assign(product, updateProductRequest);
    await this.productsRepository.save(product);
  }

  async getAllByIds(ids: number[]): Promise<ProductEntity[]> {
    return this.productsRepository.getAllByIds(ids);
  }
}
