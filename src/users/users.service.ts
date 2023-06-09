import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.prisma.repository';
import { NotFoundError } from '../common/errors/not-found.error';
import { ForbiddenError } from '../common/errors/forbidden.error';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const hash = await bcrypt.hash(createUserDto.password, 8);
    return this.usersRepository.create({ ...createUserDto, password: hash });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne(id);
    if (!user) throw new NotFoundError('Usuário não encontrado.');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, userId: string) {
    if (id !== userId) throw new ForbiddenError('Não possui permissão.');

    let hash: string;
    if (updateUserDto.password)
      hash = await bcrypt.hash(updateUserDto.password, 8);

    return this.usersRepository.update(id, {
      ...updateUserDto,
      password: hash,
    });
  }

  async remove(id: string, userId: string) {
    if (id !== userId) throw new ForbiddenError('Não possui permissão.');
    return this.usersRepository.remove(id);
  }
}
