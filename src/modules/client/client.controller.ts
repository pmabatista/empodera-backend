import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientDto } from './dto/client.dto';
import { ResponseService } from '../../common/services/response.service';
import { ContractStatus } from '../contract/enum/contract-status.enum';
import { ApiResponse, ApiNotFoundResponse } from '@nestjs/swagger';

@Controller('client')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Client successfully created.' })
  @ApiNotFoundResponse({ description: 'Not found.' })
  async create(@Body() createClientDto: ClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of clients returned successfully.',
  })
  async findMany(
    @Query('status') status: ContractStatus,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const { data, hasNext } = await this.clientService.findMany(
      status,
      page,
      limit,
    );
    return this.responseService.formatResponse(data, hasNext);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Client found successfully.' })
  @ApiNotFoundResponse({ description: 'Client not found.' })
  async findOne(@Param('id') id: string) {
    return this.clientService.findOne(+id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Client updated successfully.' })
  @ApiNotFoundResponse({ description: 'Client not found.' })
  async update(@Param('id') id: string, @Body() updateClientDto: ClientDto) {
    return this.clientService.update(+id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'Client deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Client not found.' })
  async remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }
}
