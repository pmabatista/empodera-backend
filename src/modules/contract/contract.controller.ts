import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  Query,
} from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractDto } from './dto/contract.dto';
import { ResponseService } from '../../common/services/response.service';
import { ContractStatus } from './enum/contract-status.enum';

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
  async findMany(@Query('status') status: ContractStatus) {
    const contract = await this.contractService.findMany(status);
    return this.responseService.formatResponse(contract);
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

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.contractService.cancel(+id);
  }
}
