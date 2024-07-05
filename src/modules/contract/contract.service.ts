import { Injectable } from '@nestjs/common';
import { ContractDto } from './dto/contract.dto';
import { Contract } from './entities/contract.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
  ) {}

  create(createContractDto: ContractDto) {
    return this.contractsRepository.save(createContractDto);
  }

  findAll(): Promise<Contract[]> {
    return this.contractsRepository.find({ relations: ['client'] });
  }

  findOne(id: number) {
    return this.contractsRepository.findOne({
      where: { id },
      relations: ['client'],
    });
  }

  update(id: number, updateContractDto: ContractDto) {
    return this.contractsRepository.update(id, updateContractDto);
  }

  remove(id: number) {
    return this.contractsRepository.delete(id);
  }
}
