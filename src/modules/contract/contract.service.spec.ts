import { Test, TestingModule } from '@nestjs/testing';
import { ContractService } from './contract.service';
import { Contract } from './entities/contract.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ContractStatus } from './enum/contract-status.enum';

describe('ContractService', () => {
  let service: ContractService;

  const mockContractRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockContract: Contract = {
    id: 1,
    contractNumber: '1234',
    contractDate: new Date(),
    contractValue: 1200,
    status: ContractStatus.OnTime,
    client: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractService,
        {
          provide: getRepositoryToken(Contract),
          useValue: mockContractRepository,
        },
      ],
    }).compile();

    service = module.get<ContractService>(ContractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw a NotFoundException if the contract is not found', async () => {
      mockContractRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return a contract', async () => {
      mockContractRepository.findOne.mockResolvedValueOnce(mockContract);
      const result = await service.findOne(1);
      expect(result).toEqual(mockContract);
      expect(mockContractRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('cancel', () => {
    it('should throw a NotFoundException if the contract is not found', async () => {
      mockContractRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.cancel(1)).rejects.toThrow(NotFoundException);
    });

    it('should cancel the contract', async () => {
      const contract = { ...mockContract, status: ContractStatus.OnTime };
      mockContractRepository.findOne.mockResolvedValueOnce(contract);
      const canceledContract = { ...contract, status: ContractStatus.Canceled };
      mockContractRepository.save.mockResolvedValueOnce(canceledContract);

      await service.cancel(1);
      expect(mockContractRepository.save).toHaveBeenCalledWith(
        canceledContract,
      );
    });
  });
});
