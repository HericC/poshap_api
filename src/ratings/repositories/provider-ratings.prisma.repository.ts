import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProviderRatingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(uncheckedData: Prisma.ProviderRatingUncheckedCreateInput) {
    const userId = uncheckedData.userId;
    delete uncheckedData.userId;

    const data: Prisma.ProviderRatingCreateInput = {
      ...uncheckedData,
      user: { connect: { id: userId } },
    };

    return this.prisma.providerRating.create({
      data,
    });
  }

  async findAll(where: Prisma.ProviderRatingWhereInput) {
    return this.prisma.providerRating.findMany({ where });
  }

  async averageRating(userId: string) {
    return this.prisma.providerRating.aggregate({
      where: { userId },
      _avg: { providerRating: true, serviceRating: true },
    });
  }
}
