import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesRepository } from './repositories/services.prisma.repository';
import { NotFoundError } from '../common/errors/not-found.error';
import { UnauthorizedError } from '../common/errors/unauthorized.error';

@Injectable()
export class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  async create(createServiceDto: CreateServiceDto, userId: string) {
    return this.servicesRepository.create({
      ...createServiceDto,
      providerId: userId,
    });
  }

  async findAll() {
    return this.servicesRepository.findAll({});
  }

  async findOne(id: string) {
    const service = await this.servicesRepository.findOne(id);
    if (!service) throw new NotFoundError('Serviço não encontrado.');
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, userId: string) {
    const service = await this.findOne(id);

    if (service.providerId !== userId)
      throw new UnauthorizedError('Não possui permissão.');

    return this.servicesRepository.update(id, updateServiceDto);
  }

  async remove(id: string, userId: string) {
    const service = await this.findOne(id);

    if (service.providerId !== userId)
      throw new UnauthorizedError('Não possui permissão.');

    return this.servicesRepository.remove(id);
  }
}
