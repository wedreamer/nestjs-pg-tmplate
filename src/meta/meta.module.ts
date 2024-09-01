import { Module } from '@nestjs/common';
import { MetaController } from './meta.controller';
import { DiscoveryModule } from '@nestjs/core';
import { MetaService } from './meta.service';

@Module({
  imports: [DiscoveryModule],
  controllers: [MetaController],
  providers: [MetaService],
})
export class MetaModule {}
