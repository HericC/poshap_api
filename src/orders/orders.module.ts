import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './repositories/orders.prisma.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ServicesModule } from '../services/services.module';
import { RatingsModule } from '../ratings/ratings.module';

@Module({
  imports: [ServicesModule, RatingsModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, PrismaService],
  exports: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
