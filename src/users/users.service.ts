import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UsersRepository } from './repositories/users.prisma.repository';
import { PlansRepository } from './repositories/plans.prisma.repository';
import { RatingsService } from '../ratings/ratings.service';
import { NotFoundError } from '../common/errors/not-found.error';
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

  async findAllPlans() {
    return this.plansRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne(id);
    if (!user) throw new NotFoundError('Usuário não encontrado.');

    const ratings = await this.ratingsService.averageRatings(id);
    return { ...user, ratings };
  }

  async update(updateUserDto: UpdateUserDto, userId: string) {
    let hash: string;
    if (updateUserDto.password)
      hash = await bcrypt.hash(updateUserDto.password, 8);

    return this.usersRepository.update(userId, {
      ...updateUserDto,
      password: hash,
    });
  }

  async updatePlan({ key }: UpdateStatusDto, userId: string) {
    const plan = await this.plansRepository.findOne(key);
    if (!plan) throw new DatabaseError('Plano não encontrado.');

    // future implementation

    return this.usersRepository.update(userId, { planKey: key });
  }

  async remove(userId: string) {
    return this.usersRepository.remove(userId);
  }
}
