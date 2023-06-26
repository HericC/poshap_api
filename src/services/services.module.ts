import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ServicesRepository } from './repositories/services.prisma.repository';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from '../users/users.module';
import { RatingsModule } from 'src/ratings/ratings.module';

@Module({
  imports: [UsersModule, RatingsModule],
  controllers: [ServicesController],
  providers: [ServicesService, ServicesRepository, PrismaService],
  exports: [ServicesService, ServicesRepository],
})
export class ServicesModule {}
