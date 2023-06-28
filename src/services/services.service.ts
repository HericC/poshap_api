import { Injectable } from '@nestjs/common';
import { Service, User } from '@prisma/client';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FilterServiceDto } from './dto/filter-service.dto';
import { ServicesRepository } from './repositories/services.prisma.repository';
import { UsersService } from '../users/users.service';
import { RatingsService } from '../ratings/ratings.service';
import { NotFoundError } from '../common/errors/not-found.error';
import { ForbiddenError } from '../common/errors/forbidden.error';

@Injectable()
export class ServicesService {
  constructor(
    private readonly servicesRepository: ServicesRepository,
    private readonly usersService: UsersService,
    private readonly ratingsService: RatingsService,
  ) {}

  private async validateCreateAndUpdate(
    serviceDto: CreateServiceDto | UpdateServiceDto,
    user: User,
    updatePriority = false,
  ) {
    if (serviceDto.scheduling && user.planKey !== 'gold')
      throw new ForbiddenError('Plano incompatível com a opção de agendamento');

    if (updatePriority) return updatePriority;

    let priority = user.planKey !== 'basic';
    if (!priority && serviceDto.priority) {
      await this.usersService.debit(1, user.id);
      priority = true;
    }

    return priority;
  }

  async create(createServiceDto: CreateServiceDto, userId: string) {
    const user = await this.usersService.findOne(userId);

    const priority = await this.validateCreateAndUpdate(
      createServiceDto,
      user as User,
    );

    return this.servicesRepository.create({
      ...createServiceDto,
      providerId: user.id,
      priority,
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

    const _services = await this.servicesRepository.findAll({
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

    const services: Service[] = [];
    for (const service of _services) {
      const ratings = await this.ratingsService.averageRatings(
        service.providerId,
      );

      if (
        !rating ||
        !ratings.providerRating ||
        !ratings.serviceRating ||
        ratings.providerRating >= +rating ||
        ratings.serviceRating >= +rating
      )
        services.push(service);
    }
    return services;
  }

  async findAllCategories() {
    const categories = await this.servicesRepository.findAllCategories();
    return categories.map((category) => category.category);
  }

  async findMinAndMaxPrices() {
    const prices = await this.servicesRepository.findMinAndMaxPrices();
    return { minPrice: prices._min.price, maxPrice: prices._max.price };
  }

  async findAllLogged(userId: string) {
    return this.servicesRepository.findAll({ providerId: userId });
  }

  async findOne(id: string) {
    const service = await this.servicesRepository.findOne(id);
    if (!service) throw new NotFoundError('Serviço não encontrado');

    const ratings = await this.ratingsService.averageRatings(
      service.providerId,
    );
    service.provider = { ...service.provider, ratings } as any;

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, userId: string) {
    const service = await this.findOne(id);

    if (service.providerId !== userId)
      throw new ForbiddenError('Não possui permissão');

    const user = await this.usersService.findOne(userId);

    const priority = await this.validateCreateAndUpdate(
      updateServiceDto,
      user as User,
      service.priority,
    );

    return this.servicesRepository.update(id, {
      ...updateServiceDto,
      priority,
    });
  }

  async remove(id: string, userId: string) {
    const service = await this.findOne(id);

    if (service.providerId !== userId)
      throw new ForbiddenError('Não possui permissão');

    return this.servicesRepository.remove(id);
  }
}
