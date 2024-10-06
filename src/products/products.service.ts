import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { ProductDto } from './dto/product.dto';
import { plainToInstance } from 'class-transformer';
import { CreateProductRequest } from './dto/create-product.request';
import { UpdateProductRequest } from './dto/update-product.request';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  async getAllActives(): Promise<ProductDto[]> {
    const productEntities = await this.productsRepository.getAllActives();
    return plainToInstance(ProductDto, productEntities);
  }

  async getOneActiveById(id: number): Promise<ProductDto> {
    const productEntity = await this.productsRepository.getOneActiveById(id);
    return plainToInstance(ProductDto, productEntity);
  }

  async deleteById(id: number): Promise<void> {
    const product = await this.productsRepository.getOneActiveById(id);
    if (!product) {
      throw new NotFoundException('Product not found or already deleted.');
    }
    product.isDeleted = true;
    await this.productsRepository.save(product);
  }

  async create(createProductRequest: CreateProductRequest): Promise<number> {
    await this.validateUniqueName(createProductRequest.name);

    const newProduct = this.productsRepository.create(createProductRequest);
    const product = await this.productsRepository.save(newProduct);
    return product.id;
  }

  private async validateUniqueName(name: string) {
    const existingProduct = await this.productsRepository.findOneByName(name);

    if (existingProduct) {
      throw new BadRequestException(
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
}
