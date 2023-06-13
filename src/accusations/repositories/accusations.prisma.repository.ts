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

const include: Prisma.AccusationInclude = {
  accused: { select: user },
  accuser: { select: user },
};

@Injectable()
export class AccusationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(uncheckedData: Prisma.AccusationUncheckedCreateInput) {
    const accusedId = uncheckedData.accusedId;
    const accuserId = uncheckedData.accuserId;
    delete uncheckedData.accusedId;
    delete uncheckedData.accuserId;

    const data: Prisma.AccusationCreateInput = {
      ...uncheckedData,
      accused: { connect: { id: accusedId } },
      accuser: { connect: { id: accuserId } },
    };

    return this.prisma.accusation.create({
      data,
    });
  }

  async findAll(where: Prisma.AccusationWhereInput) {
    return this.prisma.accusation.findMany({ where });
  }

  async findOne(id: string) {
    return this.prisma.accusation.findUnique({
      where: { id },
      include,
    });
  }

  async count(where: Prisma.AccusationWhereInput) {
    return this.prisma.accusation.count({ where });
  }
}
