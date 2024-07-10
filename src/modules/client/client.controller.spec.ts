import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ResponseService } from '../../common/services/response.service';
import { ClientDto } from './dto/client.dto';
import { ContractStatus } from '../contract/enum/contract-status.enum';

describe('ClientController', () => {
  let controller: ClientController;

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

  const mockClientService = {
    create: jest.fn(),
    findMany: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockResponseService = {
    formatResponse: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        {
          provide: ClientService,
          useValue: mockClientService,
        },
        {
          provide: ResponseService,
          useValue: mockResponseService,
        },
      ],
    }).compile();

    controller = module.get<ClientController>(ClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call clientService.create with the correct parameters', async () => {
      const client = { id: 1, ...mockClient };

      mockClientService.create.mockResolvedValueOnce(client);
      const result = await controller.create(mockClient);
      expect(result).toEqual(client);
      expect(mockClientService.create).toHaveBeenCalledWith(mockClient);
    });
  });

  describe('findMany', () => {
    it('should call clientService.findMany and responseService.formatResponse', async () => {
      const clients = [{ id: 1, name: 'John Doe', ...mockClient }];
      const response = { data: clients, hasNext: false };

      mockClientService.findMany.mockResolvedValueOnce(response);
      mockResponseService.formatResponse.mockReturnValueOnce(response);

      const result = await controller.findMany(ContractStatus.OnTime, 1, 10);
      expect(mockClientService.findMany).toHaveBeenCalledWith(
        ContractStatus.OnTime,
        1,
        10,
      );
      expect(mockResponseService.formatResponse).toHaveBeenCalledWith(
        clients,
        false,
      );
      expect(result).toEqual(response);
    });
  });

  describe('findOne', () => {
    it('should call clientService.findOne with the correct parameters', async () => {
      const client = { id: 1, name: 'John Doe', ...mockClient };
      mockClientService.findOne.mockResolvedValueOnce(client);

      const result = await controller.findOne('1');
      expect(mockClientService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(client);
    });
  });

  describe('update', () => {
    it('should call clientService.update with the correct parameters', async () => {
      const client = { id: 1, ...mockClient };
      mockClientService.update.mockResolvedValueOnce(client);

      const result = await controller.update('1', mockClient);
      expect(mockClientService.update).toHaveBeenCalledWith(1, mockClient);
      expect(result).toEqual(client);
    });
  });

  describe('remove', () => {
    it('should call clientService.remove with the correct parameters', async () => {
      const client = { id: 1 };
      mockClientService.remove.mockResolvedValueOnce(client);

      const result = await controller.remove('1');
      expect(mockClientService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(client);
    });
  });
});
