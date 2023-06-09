import { Module } from '@nestjs/common';
import { OngoingService } from './ongoing.service';
import { OngoingController } from './ongoing.controller';
import { OngoingRepository } from './repositories/ongoing.prisma.repository';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersModule } from '../orders/orders.module';
import { RatingsModule } from '../ratings/ratings.module';

@Module({
  imports: [OrdersModule, RatingsModule],
  controllers: [OngoingController],
  providers: [OngoingService, OngoingRepository, PrismaService],
  exports: [OngoingRepository],
})
export class OngoingModule {}
