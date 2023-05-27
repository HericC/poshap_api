import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.prisma.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const hash = await bcrypt.hash(createUserDto.password, 8);
    return this.usersRepository.create({ ...createUserDto, password: hash });
  }

  async findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: string) {
    return this.usersRepository.findOne(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let hash: string;
    if (updateUserDto.password)
      hash = await bcrypt.hash(updateUserDto.password, 8);

    return this.usersRepository.update(id, {
      ...updateUserDto,
      password: hash,
    });
  }

  async remove(id: string) {
    return this.usersRepository.remove(id);
  }
}
