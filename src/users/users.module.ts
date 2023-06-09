import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './repositories/users.prisma.repository';
import { PlansRepository } from './repositories/plans.prisma.repository';
import { PaymentsRepository } from './repositories/payments.prisma.repository';
import { PrismaService } from '../prisma/prisma.service';
import { RatingsModule } from '../ratings/ratings.module';

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.ASAAS_URL,
      headers: {
        'Content-Type': 'application/json',
        access_token: process.env.ASAAS_SECRET,
      },
    }),
    RatingsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    PlansRepository,
    PaymentsRepository,
    PrismaService,
  ],
  exports: [UsersService, UsersRepository, PlansRepository],
})
export class UsersModule {}
