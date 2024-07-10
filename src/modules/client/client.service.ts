import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientDto } from './dto/client.dto';
import { Client } from './entities/client.entity';
import { ContractStatus } from '../contract/enum/contract-status.enum';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(createClientDto: ClientDto) {
    const client = this.clientsRepository.create({
      name: createClientDto.name,
      document: createClientDto.document,
      phone: createClientDto.phone,
      contract: {
        contractNumber: createClientDto.contractNumber,
        contractDate: createClientDto.contractDate,
        contractValue: createClientDto.contractValue,
        status: createClientDto.contractStatus,
      },
    });
    return this.clientsRepository.save(client);
  }

  async findMany(
    status?: ContractStatus,
    page: number = 1,
    limit: number = 10,
  ) {
    const [results, total] = await this.clientsRepository.findAndCount({
      relations: ['contract'],
      where: { contract: { status } },
      take: limit,
      skip: (page - 1) * limit,
    });

    const hasNext = page * limit < total;

    return { data: results, hasNext };
  }

  async findOne(id: number) {
    const client = await this.clientsRepository.findOne({
      relations: ['contract'],
      where: { id },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    const { contract } = client;
    delete client.contract;
    return {
      ...client,
      contractId: contract.id,
      contractNumber: contract.contractNumber,
      contractDate: contract.contractDate.toLocaleDateString('en-CA'),
      contractValue: contract.contractValue,
      contractStatus: contract.status,
    };
  }

  async update(id: number, updateClientDto: ClientDto): Promise<Client> {
    const client = await this.clientsRepository.preload({
      id,
      name: updateClientDto.name,
      document: updateClientDto.document,
      phone: updateClientDto.phone,
      contract: {
        id: updateClientDto.contractId,
        contractNumber: updateClientDto.contractNumber,
        contractDate: updateClientDto.contractDate,
        contractValue: updateClientDto.contractValue,
        status: updateClientDto.contractStatus,
      },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return this.clientsRepository.save(client);
  }

  async remove(id: number) {
    await this.clientsRepository.delete(id);
  }
}
