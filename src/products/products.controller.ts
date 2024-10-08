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
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductResponse } from './dto/product.response';
import { ProductRequest } from './dto/product.request';
import { UpdateProductRequest } from './dto/update-product.request';
import { ApiKeyGuard } from '../auth/api-key.guard';

@ApiTags('Products')
@Controller('v1/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @ApiOperation({
    summary: 'Get all active products',
  })
  @UseGuards(ApiKeyGuard)
  @Get()
  getAllActives(): Promise<ProductResponse[]> {
    this.logger.debug(`[getAllActives] - called}`, ProductsController.name);
    return this.productsService.getAllActives();
  }

  @ApiOperation({
    summary: 'Get one active product by id',
  })
  @UseGuards(ApiKeyGuard)
  @Get(':id')
  getOneActiveById(@Param('id') id: number): Promise<ProductResponse> {
    this.logger.debug(
      `[getOneActiveById] - called with id:${id}`,
      ProductsController.name,
    );
    return this.productsService.getOneActiveById(id);
  }

  @ApiOperation({
    summary: 'Delete one product by id',
  })
  @UseGuards(ApiKeyGuard)
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
  @UseGuards(ApiKeyGuard)
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
  @UseGuards(ApiKeyGuard)
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
