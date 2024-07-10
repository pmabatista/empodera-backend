import { Client } from '../../client/entities/client.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { ContractStatus } from '../enum/contract-status.enum';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contractNumber: string;

  @Column()
  contractDate: Date;

  @Column('float')
  contractValue: number;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.OnTime,
  })
  status: ContractStatus;

  @OneToOne(() => Client, (client) => client.contract, { nullable: true })
  client: Client;
}
