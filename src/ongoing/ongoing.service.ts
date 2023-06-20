import { Injectable } from '@nestjs/common';
import { CreateOngoingDto } from './dto/create-ongoing.dto';
import { FilterOngoingDto } from './dto/filter-ongoing.dto';
import { OngoingRepository } from './repositories/ongoing.prisma.repository';
import { OrdersService } from '../orders/orders.service';
import { NotFoundError } from '../common/errors/not-found.error';
import { ForbiddenError } from '../common/errors/forbidden.error';

@Injectable()
export class OngoingService {
  constructor(
    private readonly ongoingRepository: OngoingRepository,
    private readonly orderService: OrdersService,
  ) {}

  async create({ orderId }: CreateOngoingDto, userId: string) {
    const order = await this.orderService.findOne(orderId, userId);

    if (order.providerId !== userId)
      throw new ForbiddenError('Não possui permissão');

    if (order.scheduledDate && !order.scheduled)
      return this.orderService.acceptScheduling(order.id);

    const ongoing = await this.ongoingRepository.findOneByProvider(
      order.providerId,
    );

    if (ongoing)
      throw new ForbiddenError('Não pode ter mais de 1 serviço em andamento');

    await this.orderService.remove(orderId, userId);

    return this.ongoingRepository.create({
      category: order.category,
      price: order.price,
      description: order.description,
      providerId: order.providerId,
      clientId: order.clientId,
    });
  }

  async findAllProvider({ status }: FilterOngoingDto, userId: string) {
    return this.ongoingRepository.findAll({
      providerId: userId,
      finishedDate: status ? { isSet: status === 'finished' } : undefined,
      canceledDate: status ? { isSet: status === 'canceled' } : undefined,
    });
  }

  async findAllClient({ status }: FilterOngoingDto, userId: string) {
    return this.ongoingRepository.findAll({
      clientId: userId,
      finishedDate: status ? { isSet: status === 'finished' } : undefined,
      canceledDate: status ? { isSet: status === 'canceled' } : undefined,
    });
  }

  async findOne(id: string, userId: string) {
    const ongoing = await this.ongoingRepository.findOne(id);

    if (!ongoing)
      throw new NotFoundError('Serviço em andamento não encontrado');

    if (!(ongoing.providerId === userId || ongoing.clientId === userId))
      throw new ForbiddenError('Não possui permissão');

    return ongoing;
  }

  async finished(id: string, userId: string) {
    const ongoing = await this.findOne(id, userId);

    if (ongoing.providerId !== userId)
      throw new ForbiddenError('Não possui permissão');

    if (ongoing.finishedDate)
      throw new ForbiddenError('O serviço em andamento já foi finalizado');

    if (ongoing.canceledDate)
      throw new ForbiddenError('O serviço em andamento já foi cancelado');

    return this.ongoingRepository.update(id, { finishedDate: new Date() });
  }

  async canceled(id: string, userId: string) {
    const ongoing = await this.findOne(id, userId);

    if (!(ongoing.providerId === userId || ongoing.clientId === userId))
      throw new ForbiddenError('Não possui permissão');

    if (ongoing.finishedDate)
      throw new ForbiddenError('O serviço em andamento já foi finalizado');

    if (ongoing.canceledDate)
      throw new ForbiddenError('O serviço em andamento já foi cancelado');

    return this.ongoingRepository.update(id, {
      canceledDate: new Date(),
      canceledUserId: userId,
    });
  }

  async cancellationScore(canceledUserId: string) {
    const ongoingCanceled = await this.ongoingRepository.findAll({
      canceledUserId: canceledUserId,
      finishedDate: { isSet: false },
      canceledDate: { isSet: true },
    });

    let score = 0;
    for (const ongoing of ongoingCanceled) {
      const { createdAt, canceledDate } = ongoing;

      const seconds = canceledDate.getTime() - createdAt.getTime();
      const minutes = seconds / 60000;

      if (minutes > 120) score += 18;
      else if (minutes > 60) score += 9;
      else if (minutes > 30) score += 3;
      else if (minutes > 10) score += 1;
    }

    return { score };
  }
}
