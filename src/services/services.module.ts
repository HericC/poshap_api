import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ServicesRepository } from './repositories/services.prisma.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, ServicesRepository, PrismaService],
  exports: [ServicesService],
})
export class ServicesModule {}
