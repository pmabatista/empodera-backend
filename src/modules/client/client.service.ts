import { Injectable } from '@nestjs/common';
import { ClientDto } from './dto/create-client.dto';
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
    return this.clientsRepository.find({ relations: ['contracts'] });
  }

  findOne(id: number) {
    return this.clientsRepository.findOne({
      where: { id },
      relations: ['contracts'],
    });
  }

  update(id: number, updateClientDto: ClientDto) {
    return this.clientsRepository.update(id, updateClientDto);
  }

  remove(id: number) {
    return this.clientsRepository.delete(id);
  }
}
