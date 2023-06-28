import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(uncheckedData: Prisma.PaymentUncheckedCreateInput) {
    const userId = uncheckedData.userId;
    delete uncheckedData.userId;

    const data: Prisma.PaymentCreateInput = {
      ...uncheckedData,
      user: { connect: { id: userId } },
    };

    return this.prisma.payment.create({
      data,
    });
  }

  async findAll(where: Prisma.PaymentWhereInput) {
    return this.prisma.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
    });
  }

  async findOnePendingByUser(userId: string) {
    return this.prisma.payment.findFirst({
      where: {
        userId: userId,
        status: { in: ['WAITING', 'PENDING'] },
      },
    });
  }

  async update(id: string, uncheckedData: Prisma.PaymentUncheckedUpdateInput) {
    const data: Prisma.PaymentUpdateInput = { ...uncheckedData };

    return this.prisma.payment.update({
      where: { id },
      data,
      include: { user: true },
    });
  }
}
