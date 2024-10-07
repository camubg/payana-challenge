import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  LoggerService,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { InvoiceRequest } from './dto/invoice.request';
import { InvoiceResponse } from './dto/invoice.response';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { InvoiceFiltersDto } from './dto/invoice-filters.dto';

@ApiTags('Invoices')
@Controller('v1/invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @ApiOperation({
    summary: 'Create one invoice',
  })
  @UseGuards(ApiKeyGuard)
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createInvoiceRequest: InvoiceRequest,
  ): Promise<InvoiceResponse> {
    this.logger.debug(
      `[create] - called with body:${JSON.stringify(createInvoiceRequest)}`,
      InvoicesController.name,
    );
    return this.invoicesService.create(createInvoiceRequest);
  }

  @ApiOperation({
    summary: 'Get one invoice by id',
  })
  @UseGuards(ApiKeyGuard)
  @Get(':id')
  async getInvoice(@Param('id') id: number): Promise<InvoiceResponse> {
    this.logger.debug(
      `[getInvoice] - called with id:${id}`,
      InvoicesController.name,
    );
    return this.invoicesService.getInvoiceById(id);
  }

  @ApiOperation({
    summary: 'Get all invoices',
  })
  @UseGuards(ApiKeyGuard)
  @Get()
  async getAllInvoices(
    @Query(new ValidationPipe({ transform: true })) filters: InvoiceFiltersDto,
  ): Promise<InvoiceResponse[]> {
    this.logger.debug(`[getAllInvoices] - called`, InvoicesController.name);
    return this.invoicesService.getAllInvoices(filters);
  }
}
