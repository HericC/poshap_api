import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlansRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(uncheckedData: Prisma.PlanUncheckedCreateInput[]) {
    const data: Prisma.PlanCreateManyInput[] = [...uncheckedData];

    return this.prisma.plan.createMany({
      data,
    });
  }

  async findAll() {
    return this.prisma.plan.findMany();
  }

  async findOne(key: string) {
    return this.prisma.plan.findUnique({
      where: { key },
    });
  }
}
