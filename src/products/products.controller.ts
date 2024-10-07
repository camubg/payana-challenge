import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  LoggerService,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { ProductRequest } from './dto/product.request';
import { UpdateProductRequest } from './dto/update-product.request';

@ApiTags('Products')
@Controller('v1/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @ApiOperation({
    summary: 'Get all actives products',
  })
  @Get()
  getAllActives(): Promise<ProductDto[]> {
    this.logger.debug(`[getAllActives] - called}`, ProductsController.name);
    return this.productsService.getAllActives();
  }

  @ApiOperation({
    summary: 'Get one product that is active by id',
  })
  @Get(':id')
  getOneActiveById(@Param('id') id: number): Promise<ProductDto> {
    this.logger.debug(
      `[getOneActiveById] - called with id:${id}`,
      ProductsController.name,
    );
    return this.productsService.getOneActiveById(id);
  }

  @ApiOperation({
    summary: 'Delete one product by id',
  })
  @Delete(':id')
  async deleteById(@Param('id') id: number): Promise<{ id: number }> {
    this.logger.debug(
      `[deleteById] - called with id:${id}`,
      ProductsController.name,
    );
    await this.productsService.deleteById(id);
    return { id };
  }

  @ApiOperation({
    summary: 'Create one product',
  })
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createProductRequest: ProductRequest,
  ): Promise<{ id: number }> {
    this.logger.debug(
      `[create] - called with body:${JSON.stringify(createProductRequest)}`,
      ProductsController.name,
    );
    const id = await this.productsService.create(createProductRequest);
    return { id };
  }

  @ApiOperation({
    summary: 'Update one product by id',
  })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe({ transform: true }))
    updateProductRequest: UpdateProductRequest,
  ): Promise<void> {
    this.logger.debug(
      `[update] - called with id: ${id} and body:${JSON.stringify(updateProductRequest)}`,
      ProductsController.name,
    );
    await this.productsService.update(id, updateProductRequest);
  }
}
