import { Module } from '@nestjs/common';
import { AccusationsService } from './accusations.service';
import { AccusationsController } from './accusations.controller';
import { AccusationsRepository } from './repositories/accusations.prisma.repository';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { ServicesModule } from '../services/services.module';
import { OrdersModule } from '../orders/orders.module';
import { OngoingModule } from '../ongoing/ongoing.module';

@Module({
  imports: [
    UsersModule,
    MailModule,
    ServicesModule,
    OrdersModule,
    OngoingModule,
  ],
  controllers: [AccusationsController],
  providers: [AccusationsService, AccusationsRepository, PrismaService],
})
export class AccusationsModule {}
