import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientDto } from './dto/client.dto';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  create(createClientDto: ClientDto) {
    return this.clientsRepository.save(createClientDto);
  }

  findAll() {
    return this.clientsRepository.find({ relations: ['contract'] });
  }

  async findOne(id: number) {
    const client = await this.clientsRepository.findOne({
      relations: ['contract'],
      where: { id },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    const contractId = client?.contract?.id;
    delete client.contract;
    return {
      ...client,
      contractId,
    };
  }

  async update(id: number, updateClientDto: ClientDto): Promise<Client> {
    const client = await this.clientsRepository.preload({
      id,
      ...updateClientDto,
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return this.clientsRepository.save(client);
  }

  remove(id: number) {
    return this.clientsRepository.delete(id);
  }
}
