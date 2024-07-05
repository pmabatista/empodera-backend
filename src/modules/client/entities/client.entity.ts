import { Contract } from '../../contract/entities/contract.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  document: string;

  @Column()
  phone: string;

  @OneToMany(() => Contract, (contract) => contract.client)
  contracts: Contract[];
}
