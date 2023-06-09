import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const include = {
  provider: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
  client: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
};

@Injectable()
export class OngoingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(uncheckedData: Prisma.OngoingUncheckedCreateInput) {
    const providerId = uncheckedData.providerId;
    const clientId = uncheckedData.clientId;
    delete uncheckedData.providerId;
    delete uncheckedData.clientId;

    const data: Prisma.OngoingCreateInput = {
      ...uncheckedData,
      provider: { connect: { id: providerId } },
      client: { connect: { id: clientId } },
    };

    return this.prisma.ongoing.create({
      data,
    });
  }

  async findAll(where: Prisma.OngoingWhereInput) {
    return this.prisma.ongoing.findMany({ where });
  }

  async findOne(id: string) {
    return this.prisma.ongoing.findUnique({
      where: { id },
      include,
    });
  }

  async findOneByProvider(providerId: string) {
    return this.prisma.ongoing.findMany({
      where: {
        providerId,
        finishedDate: { isSet: false },
        canceledDate: { isSet: false },
      },
      include,
    });
  }

  async update(
    id: string,
    uncheckedData: { finishedDate?: Date; canceledDate?: Date },
  ) {
    const data: Prisma.OngoingUpdateInput = { ...uncheckedData };

    return this.prisma.ongoing.update({
      where: { id },
      data,
    });
  }
}
