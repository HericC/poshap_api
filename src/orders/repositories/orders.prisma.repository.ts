import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const user = {
  id: true,
  name: true,
  email: true,
  phone: true,
  blockDate: true,
};

const include: Prisma.OrderInclude = {
  provider: { select: user },
  client: { select: user },
};

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(uncheckedData: Prisma.OrderUncheckedCreateInput) {
    const providerId = uncheckedData.providerId;
    const clientId = uncheckedData.clientId;
    delete uncheckedData.providerId;
    delete uncheckedData.clientId;

    const data: Prisma.OrderCreateInput = {
      ...uncheckedData,
      provider: { connect: { id: providerId } },
      client: { connect: { id: clientId } },
    };

    return this.prisma.order.create({
      data,
    });
  }

  async findAll(where: Prisma.OrderWhereInput) {
    return this.prisma.order.findMany({ where });
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include,
    });
  }

  async update(id: string, uncheckedData: { scheduled: boolean }) {
    const data: Prisma.OrderUpdateInput = { ...uncheckedData };

    return this.prisma.order.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }

  async removeAllByUser(userId: string) {
    return this.prisma.order.deleteMany({
      where: { OR: [{ providerId: userId }, { clientId: userId }] },
    });
  }
}
