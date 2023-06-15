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
    return this.prisma.accusation.findMany({ where });
  }

  async findOne(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: { user: true },
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
