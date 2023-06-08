import { Module } from '@nestjs/common';
import { OngoingService } from './ongoing.service';
import { OngoingController } from './ongoing.controller';
import { OngoingRepository } from './repositories/ongoing.prisma.repository';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [OrdersModule],
  controllers: [OngoingController],
  providers: [OngoingService, OngoingRepository, PrismaService],
})
export class OngoingModule {}
