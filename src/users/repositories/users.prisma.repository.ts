import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const selectPublic: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  blockDate: true,
  plan: {
    select: {
      key: true,
      name: true,
      description: true,
    },
  },
};

const select: Prisma.UserSelect = {
  ...selectPublic,
  cpf: true,
  planKey: true,
  planDate: true,
  wallet: true,
  paymentClientId: true,
};

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(uncheckedData: Prisma.UserUncheckedCreateInput) {
    const planKey = uncheckedData.planKey;
    delete uncheckedData.planKey;

    const data: Prisma.UserCreateInput = {
      ...uncheckedData,
      plan: { connect: { key: planKey } },
    };

    return this.prisma.user.create({
      data,
      select,
    });
  }

  async findAll(where: Prisma.UserWhereInput) {
    return this.prisma.user.findMany({
      where,
      select,
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select,
    });
  }

  async findOnePublic(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: selectPublic,
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOneByOtgCode(forgotPasswordOtgCode: string) {
    return this.prisma.user.findFirst({
      where: { forgotPasswordOtgCode },
    });
  }

  async update(id: string, uncheckedData: Prisma.UserUncheckedUpdateInput) {
    const planKey = uncheckedData.planKey?.toString();
    delete uncheckedData.planKey;

    const data: Prisma.UserUpdateInput = {
      ...uncheckedData,
      plan: planKey ? { connect: { key: planKey } } : undefined,
    };

    return this.prisma.user.update({
      where: { id },
      data,
      select,
    });
  }

  async updateMany(
    ids: string[],
    uncheckedData: Prisma.UserUncheckedUpdateManyInput,
  ) {
    return this.prisma.user.updateMany({
      where: { id: { in: ids } },
      data: uncheckedData,
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
      select,
    });
  }
}
