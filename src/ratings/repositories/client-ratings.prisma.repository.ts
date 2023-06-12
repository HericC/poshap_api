import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClientRatingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(uncheckedData: Prisma.ClientRatingUncheckedCreateInput) {
    const userId = uncheckedData.userId;
    delete uncheckedData.userId;

    const data: Prisma.ClientRatingCreateInput = {
      ...uncheckedData,
      user: { connect: { id: userId } },
    };

    return this.prisma.clientRating.create({
      data,
    });
  }

  async findAll(where: Prisma.ClientRatingWhereInput) {
    return this.prisma.clientRating.findMany({ where });
  }

  async averageRating(userId: string) {
    return this.prisma.clientRating.aggregate({
      where: { userId },
      _avg: { rating: true },
    });
  }
}
