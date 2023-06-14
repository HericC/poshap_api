import { Injectable } from '@nestjs/common';
import { Plan, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  TypePayment as TypePaymentPlan,
  TypePlan,
  UpdatePlanDto,
} from './dto/update-plan.dto';
import {
  TypePayment as TypePaymentWallet,
  UpdateWalletDto,
} from './dto/update-wallet.dto';
import { UsersRepository } from './repositories/users.prisma.repository';
import { PlansRepository } from './repositories/plans.prisma.repository';
import { RatingsService } from '../ratings/ratings.service';
import { NotFoundError } from '../common/errors/not-found.error';
import { DatabaseError } from '../common/errors/database.error';
import * as bcrypt from 'bcrypt';

enum PlanTime {
  monthly = 1,
  quarterly = 3,
  semester = 6,
}

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
    return user;
  }

  async findOnePublic(id: string) {
    const user = await this.usersRepository.findOnePublic(id);
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

  private async updatePlanWallet(plan: Plan, typePlan: TypePlan, user: User) {
    const price = plan[`${typePlan}Price`];
    if (!price) throw new NotFoundError('Tipo do plano não encontrado.');

    const wallet = user.wallet - price;
    if (wallet < 0) throw new DatabaseError('Não possui saldo suficiente.');

    const planDate = new Date();
    planDate.setMonth(planDate.getMonth() + PlanTime[typePlan]);

    return this.usersRepository.update(user.id, {
      planKey: plan.key,
      planDate,
      wallet,
    });
  }

  async updatePlan(updatePlanDto: UpdatePlanDto, userId: string) {
    const { key, typePlan, typePayment } = updatePlanDto;

    const type = TypePaymentPlan[typePayment];
    if (!type) throw new NotFoundError('Tipo de pagamento não disponivel.');

    const plan = await this.plansRepository.findOne(key);
    if (!plan) throw new NotFoundError('Plano não encontrado.');

    const user = await this.findOne(userId);
    if (plan.key === user.planKey)
      throw new DatabaseError('Já possui este plano.');

    if (
      plan.key === 'basic' ||
      (plan.key === 'silver' && user.planKey === 'gold')
    )
      throw new DatabaseError('Plano inferior ao plano atual.');

    if (type === 'wallet')
      return this.updatePlanWallet(plan, typePlan, user as any);

    if (type === 'bankSlip') {
      /* future payment implementation */
    }

    if (type === 'pix') {
      /* future payment implementation */
    }
  }

  async deposit(updateWalletDto: UpdateWalletDto, userId: string) {
    const { value, typePayment } = updateWalletDto;

    const type = TypePaymentWallet[typePayment];
    if (!type) throw new NotFoundError('Tipo de pagamento não disponivel.');

    if (type === 'bankSlip') {
      /* future payment implementation */
    }

    if (type === 'pix') {
      /* future payment implementation */
    }

    const user = await this.findOne(userId);
    const wallet = user.wallet + value;
    return this.usersRepository.update(userId, { wallet });
  }

  async debit(value: number, userId: string) {
    const user = await this.findOne(userId);
    const wallet = user.wallet - value;
    if (wallet < 0) throw new DatabaseError('Não possui saldo suficiente.');
    return this.usersRepository.update(userId, { wallet });
  }

  async remove(userId: string) {
    return this.usersRepository.remove(userId);
  }
}
