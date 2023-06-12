import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const select: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  planKey: true,
  planDate: true,
  plan: {
    select: {
      key: true,
      name: true,
      description: true,
    },
  },
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

  async findAll() {
    return this.prisma.user.findMany({
      select,
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select,
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOneByOtgCode(forgotPasswordOtgCode: string) {
    return this.prisma.user.findUnique({
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

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
      select,
    });
  }
}
