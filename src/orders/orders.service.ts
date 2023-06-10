import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersRepository } from './repositories/orders.prisma.repository';
import { NotFoundError } from '../common/errors/not-found.error';
import { ServicesService } from '../services/services.service';
import { ForbiddenError } from '../common/errors/forbidden.error';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly servicesService: ServicesService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const service = await this.servicesService.findOne(
      createOrderDto.serviceId,
    );

    if (service.providerId === userId)
      throw new ForbiddenError('Não pode solicitar o seu proprio serviço.');

    if (createOrderDto.schedulingDate && !service.scheduling)
      throw new ForbiddenError('Serviço não possui a opção de agendamento.');

    const orders = await this.ordersRepository.findAll({
      providerId: service.providerId,
      clientId: userId,
    });

    if (orders.length)
      throw new ForbiddenError(
        'Não pode solicitar mais serviços desse usuário.',
      );

    return this.ordersRepository.create({
      category: service.category,
      price: service.price,
      description: service.description,
      schedulingDate: service.scheduling
        ? new Date(createOrderDto.schedulingDate)
        : undefined,
      providerId: service.providerId,
      clientId: userId,
    });
  }

  async findAllProvider(userId: string) {
    return this.ordersRepository.findAll({ providerId: userId });
  }

  async findAllClient(userId: string) {
    return this.ordersRepository.findAll({ clientId: userId });
  }

  async findOne(id: string, userId: string) {
    const order = await this.ordersRepository.findOne(id);

    if (!order)
      throw new NotFoundError('Solicitação de serviço não encontrada.');

    if (!(order.providerId === userId || order.clientId === userId))
      throw new ForbiddenError('Não possui permissão.');

    return order;
  }

  async remove(id: string, userId: string) {
    const order = await this.findOne(id, userId);

    if (!(order.providerId === userId || order.clientId === userId))
      throw new ForbiddenError('Não possui permissão.');

    return this.ordersRepository.remove(id);
  }
}
