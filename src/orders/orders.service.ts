import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersRepository } from './repositories/orders.prisma.repository';
import { NotFoundError } from '../common/errors/not-found.error';
import { ServicesService } from '../services/services.service';

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

  async findAll() {
    return this.ordersRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.ordersRepository.findOne(id);
    if (!user)
      throw new NotFoundError('Solicitação de serviço não encontrada.');
    return user;
  }

  async remove(id: string) {
    return this.ordersRepository.remove(id);
  }
}
