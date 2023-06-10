import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const select = {
  id: true,
  name: true,
  email: true,
  phone: true,
  planKey: true,
  planDate: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};

const include = {
  plan: true,
  services: {
    select: {
      id: true,
      category: true,
      price: true,
      scheduling: true,
      priority: true,
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
      select: { ...select, ...include },
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, uncheckedData: Prisma.UserUncheckedUpdateInput) {
    const data: Prisma.UserUpdateInput = { ...uncheckedData };

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
