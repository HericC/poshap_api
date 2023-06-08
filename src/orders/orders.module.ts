import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './repositories/orders.prisma.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, PrismaService],
  exports: [OrdersService],
})
export class OrdersModule {}
