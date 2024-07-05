import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
} from 'class-validator';
import { ContractStatus } from '../enum/contract-status.enum';

export class ContractDto {
  @IsNotEmpty()
  @IsNumberString()
  contractNumber: string;

  @IsNotEmpty()
  @IsDate()
  contractDate: Date;

  @IsNotEmpty()
  @IsNumber()
  contractValue: number;

  @IsNotEmpty()
  @IsEnum(ContractStatus)
  status: ContractStatus;

  @IsNotEmpty()
  @IsNumber()
  clientId: number;
}
