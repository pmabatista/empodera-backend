import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class ClientDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  document: string;

  @IsNotEmpty()
  @IsPhoneNumber('BR')
  phone: string;
}
