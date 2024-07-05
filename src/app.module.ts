import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';
import { ContractModule } from './contract/contract.module';

@Module({
  imports: [ClientModule, ContractModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
