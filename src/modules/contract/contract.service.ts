import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContractDto } from './dto/contract.dto';
import { Contract } from './entities/contract.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractStatus } from './enum/contract-status.enum';
import { ClientService } from '../client/client.service';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    private clientService: ClientService,
  ) {}

  async create(createContractDto: ContractDto) {
    const existingContract = await this.contractsRepository.findOne({
      where: {
        client: {
          id: createContractDto.clientId,
        },
      },
    });
    if (existingContract) {
      throw new ConflictException('Client already has an contract');
    }
    const client = await this.clientService.findOne(createContractDto.clientId);
    if (!client) {
      throw new NotFoundException(
        `Client with ID ${createContractDto.clientId} not found`,
      );
    }
    const contract = await this.contractsRepository.save({
      ...createContractDto,
      client,
    });

    await this.clientService.update(createContractDto.clientId, {
      ...client,
      contract: contract,
    });
    return contract;
  }

  findMany(status: ContractStatus): Promise<Contract[]> {
    return this.contractsRepository.find({
      relations: ['client'],
      where: { status },
    });
  }

  async findOne(id: number) {
    const contract = await this.contractsRepository.findOne({
      where: { id },
      relations: ['client'],
    });
    console.log(contract);
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    const clientId = contract.client.id;
    delete contract.client;
    return {
      ...contract,
      clientId,
    };
  }

  async update(id: number, updateContractDto: ContractDto) {
    const contract = await this.contractsRepository.preload({
      id,
      ...updateContractDto,
    });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return this.contractsRepository.save(contract);
  }

  remove(id: number) {
    return this.contractsRepository.delete(id);
  }

  async cancel(id: number): Promise<void> {
    console.log('cancel', id);
    const contract = await this.findOne(id);

    contract.status = ContractStatus.Canceled;
    await this.contractsRepository.save(contract);
  }
}
