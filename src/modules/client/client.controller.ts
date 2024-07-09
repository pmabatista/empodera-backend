import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientDto } from './dto/client.dto';
import { ResponseService } from 'src/common/services/response.service';

@Controller('client')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  create(@Body() createClientDto: ClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  async findAll() {
    const clients = await this.clientService.findAll();
    return this.responseService.formatResponse(clients);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateClientDto: ClientDto) {
    delete updateClientDto.contract;
    return this.clientService.update(+id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }
}
