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
import { ClientsService } from './clients.service';
import { ClientResponse } from './dto/client.response';
import { UpdateClientRequest } from './dto/update-client.request';
import { ClientRequest } from './dto/client.request';
import { ApiKeyGuard } from '../auth/api-key.guard';

@ApiTags('Clients')
@Controller('v1/clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @ApiOperation({
    summary: 'Get all active clients',
  })
  @UseGuards(ApiKeyGuard)
  @Get()
  getAllActives(): Promise<ClientResponse[]> {
    this.logger.debug(`[getAllActives] - called}`, ClientsController.name);
    return this.clientsService.getAllActives();
  }

  @ApiOperation({
    summary: 'Get one active client by id',
  })
  @UseGuards(ApiKeyGuard)
  @Get(':id')
  getOneActiveById(@Param('id') id: number): Promise<ClientResponse> {
    this.logger.debug(
      `[getOneActiveById] - called with id:${id}`,
      ClientsController.name,
    );
    return this.clientsService.getOneActiveById(id);
  }

  @ApiOperation({
    summary: 'Delete one client by id',
  })
  @UseGuards(ApiKeyGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: number): Promise<{ id: number }> {
    this.logger.debug(
      `[deleteById] - called with id:${id}`,
      ClientsController.name,
    );
    await this.clientsService.deleteById(id);
    return { id };
  }

  @ApiOperation({
    summary: 'Create one client',
  })
  @UseGuards(ApiKeyGuard)
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createClientRequest: ClientRequest,
  ): Promise<{ id: number }> {
    this.logger.debug(
      `[create] - called with body:${JSON.stringify(createClientRequest)}`,
      ClientsController.name,
    );
    const id = await this.clientsService.create(createClientRequest);
    return { id };
  }

  @ApiOperation({
    summary: 'Update one client by id',
  })
  @UseGuards(ApiKeyGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe({ transform: true }))
    updateClientRequest: UpdateClientRequest,
  ): Promise<void> {
    this.logger.debug(
      `[update] - called with id: ${id} and body:${JSON.stringify(updateClientRequest)}`,
      ClientsController.name,
    );
    await this.clientsService.update(id, updateClientRequest);
  }
}
