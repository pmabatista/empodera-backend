import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ContractStatus } from '../../../modules/contract/enum/contract-status.enum';

export class ClientDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  document: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('BR')
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  contractId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contractNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  contractDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  contractValue: number;

  @ApiProperty({
    enum: ContractStatus,
    enumName: 'ContractStatus',
    description: 'Status of the contract',
  })
  @IsNotEmpty()
  @IsEnum(ContractStatus)
  contractStatus: ContractStatus;
}
