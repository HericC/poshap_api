import { Module } from '@nestjs/common';
import { AccusationsService } from './accusations.service';
import { AccusationsController } from './accusations.controller';
import { AccusationsRepository } from './repositories/accusations.prisma.repository';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AccusationsController],
  providers: [AccusationsService, AccusationsRepository, PrismaService],
})
export class AccusationsModule {}
