import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ProviderRatingsRepository } from './repositories/provider-ratings.prisma.repository';
import { ClientRatingsRepository } from './repositories/client-ratings.prisma.repository';

@Module({
  controllers: [RatingsController],
  providers: [
    RatingsService,
    ProviderRatingsRepository,
    ClientRatingsRepository,
    PrismaService,
  ],
  exports: [RatingsService],
})
export class RatingsModule {}
