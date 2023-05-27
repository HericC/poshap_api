import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

const selectOptions = {
  id: true,
  name: true,
  email: true,
  phone: true,
  password: false,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
      select: selectOptions,
    });
  }

  async findAll() {
    return this.prisma.user.findMany({ select: selectOptions });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: selectOptions,
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: selectOptions,
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id }, select: selectOptions });
  }
}
