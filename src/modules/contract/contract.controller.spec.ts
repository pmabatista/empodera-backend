import { Test, TestingModule } from '@nestjs/testing';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';

describe('ContractController', () => {
  let controller: ContractController;

  const mockContractService = {
    cancel: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractController],
      providers: [
        {
          provide: ContractService,
          useValue: mockContractService,
        },
      ],
    }).compile();

    controller = module.get<ContractController>(ContractController);
  });

  it('should call contractService.cancel with the correct parameters', async () => {
    const id = '1';
    mockContractService.cancel.mockImplementationOnce(() => Promise.resolve());

    await controller.cancel(id);
    expect(mockContractService.cancel).toHaveBeenCalledWith(1);
  });
});
