import { Injectable } from '@nestjs/common';
import { CreateOngoingDto } from './dto/create-ongoing.dto';
import { FilterOngoingDto } from './dto/filter-ongoing.dto';
import { OngoingRepository } from './repositories/ongoing.prisma.repository';
import { NotFoundError } from '../common/errors/not-found.error';
import { OrdersService } from '../orders/orders.service';
import { UnauthorizedError } from '../common/errors/unauthorized.error';

@Injectable()
export class OngoingService {
  constructor(
    private readonly ongoingRepository: OngoingRepository,
    private readonly orderService: OrdersService,
  ) {}

  async create(createOngoingDto: CreateOngoingDto, userId: string) {
    const order = await this.orderService.findOne(
      createOngoingDto.orderId,
      userId,
    );

    if (order.providerId !== userId)
      throw new UnauthorizedError('Não possui permissão.');

    await this.orderService.remove(createOngoingDto.orderId, userId);

    return this.ongoingRepository.create({
      category: order.category,
      price: order.price,
      description: order.description,
      providerId: order.providerId,
      clientId: order.clientId,
    });
  }

  async findAllProvider(filter: FilterOngoingDto, userId: string) {
    const { status } = filter;

    return this.ongoingRepository.findAll({
      providerId: userId,
      finishedDate: status ? { isSet: status === 'finished' } : undefined,
      canceledDate: status ? { isSet: status === 'canceled' } : undefined,
    });
  }

  async findAllClient(filter: FilterOngoingDto, userId: string) {
    const { status } = filter;

    return this.ongoingRepository.findAll({
      clientId: userId,
      finishedDate: status ? { isSet: status === 'finished' } : undefined,
      canceledDate: status ? { isSet: status === 'canceled' } : undefined,
    });
  }

  async findOne(id: string, userId: string) {
    const ongoing = await this.ongoingRepository.findOne(id);

    if (!ongoing)
      throw new NotFoundError('Serviço em andamento não encontrado.');

    if (!(ongoing.providerId === userId || ongoing.clientId === userId))
      throw new UnauthorizedError('Não possui permissão.');

    return ongoing;
  }

  async finished(id: string, userId: string) {
    const ongoing = await this.findOne(id, userId);

    if (ongoing.providerId !== userId)
      throw new UnauthorizedError('Não possui permissão.');

    if (ongoing.finishedDate)
      throw new NotFoundError('O serviço em andamento já foi finalizado.');

    if (ongoing.canceledDate)
      throw new NotFoundError('O serviço em andamento já foi cancelado.');

    return this.ongoingRepository.update(id, { finishedDate: new Date() });
  }

  async canceled(id: string, userId: string) {
    const ongoing = await this.findOne(id, userId);

    if (!(ongoing.providerId === userId || ongoing.clientId === userId))
      throw new UnauthorizedError('Não possui permissão.');

    if (ongoing.finishedDate)
      throw new NotFoundError('O serviço em andamento já foi finalizado.');

    if (ongoing.canceledDate)
      throw new NotFoundError('O serviço em andamento já foi cancelado.');

    return this.ongoingRepository.update(id, { canceledDate: new Date() });
  }
}
