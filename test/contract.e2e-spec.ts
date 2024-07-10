import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { ResponseService } from '../src/common/services/response.service';
import { Client } from '../src/modules/client/entities/client.entity';
import { ContractController } from '../src/modules/contract/contract.controller';
import { ContractModule } from '../src/modules/contract/contract.module';
import { ClientModule } from '../src/modules/client/client.module';
import { ContractService } from '../src/modules/contract/contract.service';
import { Contract } from '../src/modules/contract/entities/contract.entity';
import { AppModule } from '../src/app.module';
import { ContractStatus } from '../src/modules/contract/enum/contract-status.enum';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

jest.setTimeout(60000);

describe('ContractController (e2e)', () => {
  let app: INestApplication;
  let clientRepository: Repository<Client>;
  let postgresContainer: StartedPostgreSqlContainer;

  const contractId = 1;

  const mockContract = {
    contractNumber: '123456',
    contractDate: new Date().toISOString(),
    contractValue: 1000,
    status: ContractStatus.OnTime,
  };

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: postgresContainer.getHost(),
          port: postgresContainer.getMappedPort(5432),
          username: postgresContainer.getUsername(),
          password: postgresContainer.getPassword(),
          database: postgresContainer.getDatabase(),
          entities: [Contract, Client],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Contract, Client]),
        ContractModule,
        ClientModule,
        AppModule,
      ],
      controllers: [ContractController],
      providers: [ContractService, ResponseService],
    }).compile();

    app = moduleFixture.createNestApplication();
    clientRepository = moduleFixture.get<Repository<Client>>(
      getRepositoryToken(Client),
    );
    await clientRepository.save({
      name: 'John Doe',
      phone: '62981156421',
      document: '00123456789',
      contract: mockContract,
    });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await postgresContainer.stop();
  });

  it('/contract/:id/cancel (PATCH)', async () => {
    return request(app.getHttpServer())
      .patch(`/contract/${contractId}/cancel`)
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });
});
