import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.prisma.repository';
import { PlansRepository } from './repositories/plans.prisma.repository';
import { RatingsService } from '../ratings/ratings.service';
import { NotFoundError } from '../common/errors/not-found.error';
import { ForbiddenError } from '../common/errors/forbidden.error';
import { DatabaseError } from '../common/errors/database.error';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly plansRepository: PlansRepository,
    private readonly ratingsService: RatingsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const plan = await this.plansRepository.findOne('basic');
    if (!plan) throw new DatabaseError('Não foi possivel registrar o usuário.');

    const hash = await bcrypt.hash(createUserDto.password, 8);
    return this.usersRepository.create({
      ...createUserDto,
      password: hash,
      planKey: plan.key,
      planDate: new Date(),
    });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne(id);
    if (!user) throw new NotFoundError('Usuário não encontrado.');

    const ratings = await this.ratingsService.averageRatings(id);
    return { ...user, ratings };
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

  async updatePlan(id: string, key: string) {
    const plan = await this.plansRepository.findOne(key);
    if (!plan) throw new DatabaseError('Plano não encontrado.');

    // future implementation

    return this.usersRepository.update(id, { planKey: key });
  }

  async remove(id: string, userId: string) {
    if (id !== userId) throw new ForbiddenError('Não possui permissão.');
    return this.usersRepository.remove(id);
  }
}
