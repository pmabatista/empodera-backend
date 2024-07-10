import { Injectable, NotFoundException } from '@nestjs/common';
import { Contract } from './entities/contract.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractStatus } from './enum/contract-status.enum';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
  ) {}

  async findOne(id: number): Promise<Contract> {
    const contract = await this.contractsRepository.findOne({
      where: { id },
    });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return {
      ...contract,
    };
  }

  async cancel(id: number): Promise<void> {
    const contract = await this.findOne(id);

    contract.status = ContractStatus.Canceled;
    await this.contractsRepository.save(contract);
  }
}
