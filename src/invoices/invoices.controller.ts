import {
  Body,
  Controller,
  Inject,
  Logger,
  LoggerService,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { InvoiceRequest } from './dto/invoice.request';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoiceResponse } from './dto/invoice.response';

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
}
