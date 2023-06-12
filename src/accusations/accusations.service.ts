import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { CreateAccusationDto } from './dto/create-accusation.dto';
import { AccusationsRepository } from './repositories/accusations.prisma.repository';
import { UsersRepository } from '../users/repositories/users.prisma.repository';
import { ServicesRepository } from '../services/repositories/services.prisma.repository';
import { OrdersRepository } from '../orders/repositories/orders.prisma.repository';
import { OngoingRepository } from '../ongoing/repositories/ongoing.prisma.repository';
import { MailService } from '../mail/mail.service';
import { NotFoundError } from '../common/errors/not-found.error';
import { ForbiddenError } from '../common/errors/forbidden.error';

@Injectable()
export class AccusationsService {
  constructor(
    private readonly config: ConfigService,
    private readonly accusationsRepository: AccusationsRepository,
    private readonly userRepository: UsersRepository,
    private readonly servicesRepository: ServicesRepository,
    private readonly ordersRepository: OrdersRepository,
    private readonly ongoingRepository: OngoingRepository,
    private readonly mailService: MailService,
  ) {}

  private async cancelOperations(userId: string) {
    await this.servicesRepository.removeAllByUser(userId);
    await this.ordersRepository.removeAllByUser(userId);

    const ongoing = await this.ongoingRepository.findOneByProvider(userId);
    if (ongoing.length)
      await this.ongoingRepository.update(ongoing[0].id, {
        canceledDate: new Date(),
      });
  }

  private async blockUser(accusedId: string) {
    const countAccusations = await this.accusationsRepository.count({
      accusedId,
    });
    const blockDate = new Date();

    if (countAccusations > 30)
      blockDate.setFullYear(blockDate.getFullYear() + 1);
    else if (countAccusations > 20)
      blockDate.setMonth(blockDate.getMonth() + 1);
    else if (countAccusations > 10) blockDate.setDate(blockDate.getDate() + 7);

    if (blockDate <= new Date()) return;

    const user = await this.userRepository.findOne(accusedId);
    await this.userRepository.update(user.id, { blockDate });
    await this.cancelOperations(user.id);

    this.mailService.sendMail({
      to: user.email,
      subject: 'Poshap - Conta bloqueada',
      template: 'blocked-user',
      context: {
        blockDate: blockDate.toLocaleString(),
        email: this.config.get('MAIL_SUPPORT'),
      },
    });
  }

  async create(createAccusationDto: CreateAccusationDto, userId: string) {
    if (createAccusationDto.accusedId === userId)
      throw new ForbiddenError('Não pode denunciar a se próprio.');

    const accusation = await this.accusationsRepository.create({
      ...createAccusationDto,
      accuserId: userId,
    });

    await this.blockUser(createAccusationDto.accusedId);
    return accusation;
  }

  async findAllAccused(userId: string) {
    return this.accusationsRepository.findAll({ accusedId: userId });
  }

  async findAllAccuser(userId: string) {
    return this.accusationsRepository.findAll({ accuserId: userId });
  }

  async findOne(id: string) {
    const accusation = await this.accusationsRepository.findOne(id);
    if (!accusation) throw new NotFoundError('Denuncia não encontrado.');
    return accusation;
  }
}
