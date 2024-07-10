import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ClientDto } from './dto/client.dto';
import { ContractStatus } from '../contract/enum/contract-status.enum';

describe('ClientService', () => {
  let service: ClientService;

  const mockClient: ClientDto = {
    name: 'John Doe',
    document: '00123456789',
    phone: '62981156421',
    contractId: 1,
    contractNumber: '12345',
    contractDate: new Date(),
    contractValue: 1000,
    contractStatus: ContractStatus.OnTime,
  };

  const mockClientRepository = {
    save: jest.fn(),
    create: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockClientRepository,
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a client', async () => {
      const clientEntity = {
        id: 1,
        name: 'John Doe',
        document: '00123456789',
        phone: '62981156421',
        contract: {
          contractNumber: '12345',
          contractDate: new Date(mockClient.contractDate),
          contractValue: 1000,
          status: ContractStatus.OnTime,
        },
      };
      mockClientRepository.create.mockResolvedValueOnce(clientEntity);
      mockClientRepository.save.mockResolvedValueOnce(clientEntity);
      const result = await service.create(mockClient);
      expect(result).toEqual(clientEntity);
      expect(mockClientRepository.save).toHaveBeenCalled();
      expect(mockClientRepository.create).toHaveBeenCalled();
    });
  });

  describe('findMany', () => {
    it('should return an array of clients and hasNext', async () => {
      const clients = [
        {
          id: 1,
          name: 'John Doe',
          contract: {
            id: 1,
            contractNumber: '12345',
            contractDate: new Date(mockClient.contractDate),
            contractValue: 1000,
            status: ContractStatus.OnTime,
          },
        },
      ];
      const response = { data: clients, hasNext: false };

      mockClientRepository.findAndCount.mockResolvedValueOnce([clients, 1]);

      const result = await service.findMany(ContractStatus.OnTime, 1, 10);
      expect(result).toEqual(response);
      expect(mockClientRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['contract'],
        where: { contract: { status: ContractStatus.OnTime } },
        take: 10,
        skip: 0,
      });
    });
  });

  describe('findOne', () => {
    it('should throw a NotFoundException if the client is not found', async () => {
      mockClientRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return a client with contractId and other contract details', async () => {
      const client = {
        id: 1,
        name: 'John Doe',
        document: '00123456789',
        phone: '62981156421',
        contract: {
          id: 1,
          contractNumber: '12345',
          contractDate: new Date(mockClient.contractDate),
          contractValue: 1000,
          status: ContractStatus.OnTime,
        },
      };
      mockClientRepository.findOne.mockResolvedValueOnce(client);

      const result = await service.findOne(1);
      expect(result).toEqual({
        id: 1,
        name: 'John Doe',
        document: '00123456789',
        phone: '62981156421',
        contractId: 1,
        contractNumber: '12345',
        contractDate: mockClient.contractDate.toLocaleDateString('en-CA'),
        contractValue: 1000,
        contractStatus: ContractStatus.OnTime,
      });
      expect(mockClientRepository.findOne).toHaveBeenCalledWith({
        relations: ['contract'],
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should throw a NotFoundException if the client is not found', async () => {
      mockClientRepository.preload.mockResolvedValueOnce(null);
      await expect(service.update(1, mockClient)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update and return the client', async () => {
      const client = {
        id: 1,
        name: 'John Doe',
        document: '00123456789',
        phone: '62981156421',
        contract: {
          contractNumber: '12345',
          contractDate: new Date(mockClient.contractDate),
          contractValue: 1000,
          status: ContractStatus.OnTime,
        },
      };
      mockClientRepository.preload.mockResolvedValueOnce(client);
      mockClientRepository.save.mockResolvedValueOnce(client);

      const result = await service.update(1, mockClient);
      expect(result).toEqual(client);
      expect(mockClientRepository.preload).toHaveBeenCalledWith({
        id: 1,
        name: mockClient.name,
        document: mockClient.document,
        phone: mockClient.phone,
        contract: {
          id: mockClient.contractId,
          contractNumber: mockClient.contractNumber,
          contractDate: new Date(mockClient.contractDate),
          contractValue: mockClient.contractValue,
          status: mockClient.contractStatus,
        },
      });
      expect(mockClientRepository.save).toHaveBeenCalledWith(client);
    });
  });

  describe('remove', () => {
    it('should remove the client', async () => {
      mockClientRepository.delete.mockResolvedValueOnce({ affected: 1 });
      await service.remove(1);
      expect(mockClientRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
