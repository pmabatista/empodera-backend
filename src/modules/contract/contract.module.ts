import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './entities/contract.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  controllers: [ContractController],
  providers: [ContractService],
  imports: [TypeOrmModule.forFeature([Contract]), CommonModule],
})
export class ContractModule {}
