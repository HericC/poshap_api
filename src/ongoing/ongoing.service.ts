import { Injectable } from '@nestjs/common';
import { CreateOngoingDto } from './dto/create-ongoing.dto';
import { OngoingRepository } from './repositories/ongoing.prisma.repository';
import { NotFoundError } from '../common/errors/not-found.error';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class OngoingService {
  constructor(
    private readonly ongoingRepository: OngoingRepository,
    private readonly orderService: OrdersService,
  ) {}

  async create(createOngoingDto: CreateOngoingDto) {
    const order = await this.orderService.findOne(createOngoingDto.orderId);

    return this.ongoingRepository.create({
      category: order.category,
      price: order.price,
      description: order.description,
      providerId: order.providerId,
      clientId: order.clientId,
    });
  }

  async findAll() {
    return this.ongoingRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.ongoingRepository.findOne(id);
    if (!user) throw new NotFoundError('Serviço em andamento não encontrado.');
    return user;
  }

  async finished(id: string) {
    const ongoing = await this.findOne(id);

    if (ongoing.finishedDate)
      throw new NotFoundError('Serviço em andamento já foi finalizado.');

    if (ongoing.canceledDate)
      throw new NotFoundError('Serviço em andamento já foi cancelado.');

    return this.ongoingRepository.update(id, { finishedDate: new Date() });
  }

  async canceled(id: string) {
    const ongoing = await this.findOne(id);

    if (ongoing.finishedDate)
      throw new NotFoundError('Serviço em andamento já foi finalizado.');

    if (ongoing.canceledDate)
      throw new NotFoundError('Serviço em andamento já foi cancelado.');

    return this.ongoingRepository.update(id, { canceledDate: new Date() });
  }
}
