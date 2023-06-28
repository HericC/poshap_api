import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Payment, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  TypePayment as TypePaymentPlan,
  UpdatePlanDto,
} from './dto/update-plan.dto';
import {
  TypePayment as TypePaymentWallet,
  UpdateWalletDto,
} from './dto/update-wallet.dto';
import { UsersRepository } from './repositories/users.prisma.repository';
import { PlansRepository } from './repositories/plans.prisma.repository';
import { PaymentsRepository } from './repositories/payments.prisma.repository';
import { RatingsService } from '../ratings/ratings.service';
import { NotFoundError } from '../common/errors/not-found.error';
import { DatabaseError } from '../common/errors/database.error';
import { ForbiddenError } from '../common/errors/forbidden.error';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import * as bcrypt from 'bcrypt';

enum PlanTime {
  monthly = 1,
  quarterly = 3,
  semester = 6,
}

@Injectable()
export class UsersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly usersRepository: UsersRepository,
    private readonly plansRepository: PlansRepository,
    private readonly paymentsRepository: PaymentsRepository,
    private readonly ratingsService: RatingsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.repeatPassword)
      throw new DatabaseError('A repetição da senha não coincide com a senha');
    delete createUserDto.repeatPassword;

    const plan = await this.plansRepository.findOne('basic');
    if (!plan) throw new DatabaseError('Não foi possivel registrar o usuário');

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

  async findAllPayments(userId: string) {
    return this.paymentsRepository.findAll({ userId });
  }

  async findPaymentOne(id: string, userId: string) {
    const payment = await this.paymentsRepository.findOne(id);
    if (!payment) throw new NotFoundError('Pagamento não encontrado');

    if (payment.userId !== userId)
      throw new ForbiddenError('Não possui permissão');

    return payment;
  }

  async findPaymentBarCode(id: string, userId: string) {
    const payment = await this.paymentsRepository.findOne(id);
    if (!payment) throw new NotFoundError('Pagamento não encontrado');

    if (payment.userId !== userId)
      throw new ForbiddenError('Não possui permissão');

    const { data } = await firstValueFrom(
      this.httpService.post(`payments/${id}/identificationField`).pipe(
        catchError((error: AxiosError) => {
          console.error(error.response.data);
          throw new DatabaseError('Não foi possivel processar a requisição');
        }),
      ),
    );

    return { barCode: data.identificationField };
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne(id);
    if (!user) throw new NotFoundError('Usuário não encontrado');

    const ratings = await this.ratingsService.averageRatings(id);
    return { ...user, ratings };
  }

  async findOnePublic(id: string) {
    const user = await this.usersRepository.findOnePublic(id);
    if (!user) throw new NotFoundError('Usuário não encontrado');

    const ratings = await this.ratingsService.averageRatings(id);
    return { ...user, ratings };
  }

  async update(updateUserDto: UpdateUserDto, userId: string) {
    let hash: string;
    if (updateUserDto.password) {
      if (updateUserDto.password !== updateUserDto.repeatPassword)
        throw new DatabaseError(
          'A repetição da senha não coincide com a senha',
        );
      hash = await bcrypt.hash(updateUserDto.password, 8);
    }
    delete updateUserDto.repeatPassword;

    return this.usersRepository.update(userId, {
      ...updateUserDto,
      password: hash,
    });
  }

  private async paymentClient(user: User) {
    const payload = {
      name: user.name,
      cpfCnpj: user.cpf,
      email: user.email,
      phone: user.phone,
      externalReference: user.id,
      notificationDisabled: true,
    };

    const { data } = await firstValueFrom(
      this.httpService.post('customers', payload).pipe(
        catchError((error: AxiosError) => {
          console.error(error.response.data);
          throw new DatabaseError('Não foi possivel processar o pagamento');
        }),
      ),
    );

    return this.usersRepository.update(user.id, { paymentClientId: data.id });
  }

  private async payment(
    action: string,
    value: number,
    user: User,
    planKey?: string,
    time?: PlanTime,
  ) {
    const payment = await this.paymentsRepository.findOnePendingByUser(user.id);
    if (payment)
      throw new ForbiddenError('Não pode ter mais de 1 pagamento em espera');

    if (!user.paymentClientId) user = (await this.paymentClient(user)) as User;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    const payload = {
      customer: user.paymentClientId,
      billingType: 'BOLETO',
      value,
      dueDate,
      postalService: false,
    };

    const { data } = await firstValueFrom(
      this.httpService.post('payments', payload).pipe(
        catchError((error: AxiosError) => {
          console.error(error.response.data);
          throw new DatabaseError('Não foi possivel processar o pagamento');
        }),
      ),
    );

    return this.paymentsRepository.create({
      id: data.id,
      value: data.value,
      status: 'WAITING',
      action,
      type: 'bankSlip',
      url: data.bankSlipUrl,
      dueDate: new Date(data.dueDate),
      planKey,
      planTime: time,
      userId: user.id,
    });
  }

  private async updatePlanWallet(
    planKey: string,
    price: number,
    time: PlanTime,
    user: User,
  ) {
    const wallet = user.wallet - price;
    if (wallet < 0) throw new DatabaseError('Não possui saldo suficiente');

    const planDate = new Date();
    planDate.setMonth(planDate.getMonth() + time);

    return this.usersRepository.update(user.id, { planKey, planDate, wallet });
  }

  async updatePlan(updatePlanDto: UpdatePlanDto, userId: string) {
    const { key, typePlan, typePayment } = updatePlanDto;

    const type = TypePaymentPlan[typePayment];
    if (!type) throw new NotFoundError('Tipo de pagamento não disponivel');

    const plan = await this.plansRepository.findOne(key);
    if (!plan) throw new NotFoundError('Plano não encontrado');

    const user = await this.findOne(userId);
    if (plan.key === user.planKey)
      throw new DatabaseError('Já possui este plano');

    if (
      plan.key === 'basic' ||
      (plan.key === 'silver' && user.planKey === 'gold')
    )
      throw new DatabaseError('Plano inferior ao plano atual');

    const price = plan[`${typePlan}Price`];
    if (!price) throw new NotFoundError('Tipo do plano não encontrado');

    const time = PlanTime[typePlan];

    if (type === 'wallet')
      return this.updatePlanWallet(plan.key, price, time, user as any);

    if (type === 'bankSlip') {
      return this.payment('update-plan', price, user as any, plan.key, time);
    }
  }

  async deposit(updateWalletDto: UpdateWalletDto, userId: string) {
    const { value, typePayment } = updateWalletDto;

    const type = TypePaymentWallet[typePayment];
    if (!type) throw new NotFoundError('Tipo de pagamento não disponivel');

    const user = await this.findOne(userId);

    if (type === 'bankSlip') {
      return this.payment('deposit', value, user as any);
    }
  }

  async debit(value: number, userId: string) {
    const user = await this.findOne(userId);
    const wallet = user.wallet - value;
    if (wallet < 0) throw new DatabaseError('Não possui saldo suficiente');
    return this.usersRepository.update(userId, { wallet });
  }

  async remove(userId: string) {
    return this.usersRepository.remove(userId);
  }

  private async webhookUpdatePlan(payment: Payment, user: User) {
    const planDate = new Date();
    planDate.setMonth(planDate.getMonth() + payment.planTime);

    return this.usersRepository.update(user.id, {
      planKey: payment.planKey,
      planDate,
    });
  }

  private async webhookDeposit(payment: Payment, user: User) {
    const wallet = user.wallet + payment.value;
    return this.usersRepository.update(user.id, { wallet });
  }

  async webhookPayment(webhook: any) {
    const events = [
      'PAYMENT_CREATED',
      'PAYMENT_CONFIRMED',
      'PAYMENT_RECEIVED',
      'PAYMENT_OVERDUE',
      'PAYMENT_DELETED',
    ];

    if (!events.includes(webhook.event))
      return { message: 'event not allowed' };

    const payment = await this.paymentsRepository.update(webhook.payment.id, {
      status: webhook.payment.status,
    });

    if (
      payment.status === 'RECEIVED' ||
      payment.status === 'RECEIVED_IN_CASH'
    ) {
      if (payment.action === 'update-plan')
        this.webhookUpdatePlan(payment, payment.user);
      else if (payment.action === 'deposit')
        this.webhookDeposit(payment, payment.user);
    }

    return { message: 'success!!!' };
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async checkPlanExpirationTime() {
    console.info('Verificando usuários com planos expirados!');

    const users = await this.usersRepository.findAll({
      planKey: { not: 'basic' },
      planDate: { lt: new Date() },
    });

    const usersIds = users.map((user) => user.id);
    return this.usersRepository.updateMany(usersIds, { planKey: 'basic' });
  }

  async sandboxPay(id: string, userId: string) {
    const payment = await this.paymentsRepository.findOne(id);
    if (!payment) throw new NotFoundError('Pagamento não encontrado');

    if (payment.userId !== userId)
      throw new ForbiddenError('Não possui permissão');

    const payload = {
      id: payment.id,
      paymentDate: new Date(),
      value: payment.value,
      notifyCustomer: false,
    };

    await firstValueFrom(
      this.httpService.post(`payments/${id}/receiveInCash`, payload).pipe(
        catchError((error: AxiosError) => {
          console.error(error.response.data);
          throw new DatabaseError('Não foi possivel processar o pagamento');
        }),
      ),
    );
    return { message: 'success!!!' };
  }
}
