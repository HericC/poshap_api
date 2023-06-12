import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const include: Prisma.ServiceInclude = {
  provider: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      planKey: true,
      planDate: true,
      blockDate: true,
    },
  },
};

@Injectable()
export class ServicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(uncheckedData: Prisma.ServiceUncheckedCreateInput) {
    const providerId = uncheckedData.providerId;
    delete uncheckedData.providerId;

    const data: Prisma.ServiceCreateInput = {
      ...uncheckedData,
      provider: { connect: { id: providerId } },
    };

    return this.prisma.service.create({
      data,
    });
  }

  async findAll(where: Prisma.ServiceWhereInput) {
    return this.prisma.service.findMany({
      where,
      orderBy: [{ priority: 'desc' }],
    });
  }

  async findAllCategories() {
    return this.prisma.service.groupBy({
      by: ['category'],
    });
  }

  async findOne(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
      include,
    });
  }

  async update(id: string, uncheckedData: Prisma.ServiceUncheckedUpdateInput) {
    const data: Prisma.ServiceUpdateInput = { ...uncheckedData };

    return this.prisma.service.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.service.delete({
      where: { id },
    });
  }

  async removeAllByUser(userId: string) {
    return this.prisma.service.deleteMany({
      where: { providerId: userId },
    });
  }
}
