import { Client } from '../../client/entities/client.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ContractStatus } from '../enum/contract-status.enum';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contractNumber: string;

  @Column()
  contractDate: Date;

  @Column()
  contractValue: number;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.OnTime,
  })
  status: ContractStatus;

  @ManyToOne(() => Client, (client) => client.contracts)
  client: Client;
}
