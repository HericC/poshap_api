import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FilterServiceDto } from './dto/filter-service.dto';
import { ServicesRepository } from './repositories/services.prisma.repository';
import { NotFoundError } from '../common/errors/not-found.error';
import { ForbiddenError } from '../common/errors/forbidden.error';

@Injectable()
export class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  async create(createServiceDto: CreateServiceDto, userId: string) {
    return this.servicesRepository.create({
      ...createServiceDto,
      providerId: userId,
    });
  }

  async findAll(filter: FilterServiceDto) {
    const {
      search,
      minPrice,
      maxPrice,
      minWaiting,
      maxWaiting,
      minDistance,
      maxDistance,
      rating,
      categories,
    } = filter;

    return this.servicesRepository.findAll({
      OR: search
        ? [
            { category: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]
        : undefined,
      price: {
        gte: minPrice ? parseFloat(minPrice) : undefined,
        lte: maxPrice ? parseFloat(maxPrice) : undefined,
      },
      category: { in: categories, mode: 'insensitive' },
    });
  }

  async findOne(id: string) {
    const service = await this.servicesRepository.findOne(id);
    if (!service) throw new NotFoundError('Serviço não encontrado.');
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, userId: string) {
    const service = await this.findOne(id);

    if (service.providerId !== userId)
      throw new ForbiddenError('Não possui permissão.');

    return this.servicesRepository.update(id, updateServiceDto);
  }

  async remove(id: string, userId: string) {
    const service = await this.findOne(id);

    if (service.providerId !== userId)
      throw new ForbiddenError('Não possui permissão.');

    return this.servicesRepository.remove(id);
  }
}
