import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ResponseService } from '../src/common/services/response.service';
import { ClientController } from '../src/modules/client/client.controller';
import { ClientService } from '../src/modules/client/client.service';
import { Client } from '../src/modules/client/entities/client.entity';
import { Contract } from '../src/modules/contract/entities/contract.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { ContractStatus } from '../src/modules/contract/enum/contract-status.enum';
import { ClientDto } from '../src/modules/client/dto/client.dto';

jest.setTimeout(60000);

describe('ClientController (e2e)', () => {
  let app: INestApplication;
  const clientDto: ClientDto = {
    name: 'John Doe',
    document: '00123456789',
    phone: '62981156421',
    contractNumber: '123456',
    contractDate: new Date(),
    contractValue: 1000,
    contractStatus: ContractStatus.OnTime,
  };

  const clientId = 1;
  let postgresContainer: StartedPostgreSqlContainer;

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
          entities: [Client, Contract],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Client, Contract]),
      ],
      controllers: [ClientController],
      providers: [ClientService, ResponseService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await postgresContainer.stop();
  });

  it('/client (POST)', async () => {
    return request(app.getHttpServer())
      .post('/client')
      .send(clientDto)
      .expect(HttpStatus.CREATED)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: 'John Doe',
            document: '00123456789',
            phone: '62981156421',
            contract: expect.objectContaining({
              contractNumber: '123456',
              contractDate: expect.any(String),
              contractValue: 1000,
              status: ContractStatus.OnTime,
            }),
          }),
        );
      });
  });

  it('/client (GET)', async () => {
    return request(app.getHttpServer())
      .get('/client')
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual({
          items: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: 'John Doe',
              document: '00123456789',
              phone: '62981156421',
              contract: expect.objectContaining({
                contractNumber: '123456',
                contractDate: expect.any(String),
                contractValue: 1000,
                status: ContractStatus.OnTime,
              }),
            }),
          ]),
          hasNext: false,
        });
      });
  });

  it('/client/:id (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/client/${clientId}`)
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: clientId,
            name: 'John Doe',
            document: '00123456789',
            phone: '62981156421',
            contractId: expect.any(Number),
            contractNumber: '123456',
            contractDate: expect.any(String),
            contractValue: 1000,
            contractStatus: ContractStatus.OnTime,
          }),
        );
      });
  });

  it('/client/:id (PUT)', async () => {
    const updatedClientDto = {
      name: 'Jane Smith',
      document: '00123456789',
      phone: '62981156421',
      contractNumber: '123456',
      contractDate: new Date(),
      contractValue: 1000,
      contractStatus: ContractStatus.OnTime,
    };
    return request(app.getHttpServer())
      .put(`/client/${clientId}`)
      .send(updatedClientDto)
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: 'Jane Smith',
            document: '00123456789',
            phone: '62981156421',
            contract: expect.objectContaining({
              contractNumber: '123456',
              contractDate: expect.any(String),
              contractValue: 1000,
              status: ContractStatus.OnTime,
            }),
          }),
        );
      });
  });

  it('/client/:id (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete(`/client/${clientId}`)
      .expect(HttpStatus.NO_CONTENT)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });
});
