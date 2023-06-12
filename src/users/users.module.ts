import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './repositories/users.prisma.repository';
import { PlansRepository } from './repositories/plans.prisma.repository';
import { PrismaService } from '../prisma/prisma.service';
import { RatingsModule } from '../ratings/ratings.module';

@Module({
  imports: [RatingsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PlansRepository, PrismaService],
  exports: [UsersService, UsersRepository, PlansRepository],
})
export class UsersModule {}
