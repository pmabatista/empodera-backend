import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractDto } from './dto/contract.dto';
import { ResponseService } from '../../common/services/response.service';

@Controller('contract')
export class ContractController {
  constructor(
    private readonly contractService: ContractService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  create(@Body() createContractDto: ContractDto) {
    return this.contractService.create(createContractDto);
  }

  @Get()
  async findAll() {
    const contracts = await this.contractService.findAll();
    return this.responseService.formatResponse(contracts);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateContractDto: ContractDto) {
    return this.contractService.update(+id, updateContractDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contractService.remove(+id);
  }
}
