import { Controller, HttpCode, Param, Patch } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ApiResponse, ApiNotFoundResponse } from '@nestjs/swagger';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Patch(':id/cancel')
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'Contract canceled successfully.' })
  @ApiNotFoundResponse({ description: 'Contract not found.' })
  cancel(@Param('id') id: string) {
    return this.contractService.cancel(+id);
  }
}
