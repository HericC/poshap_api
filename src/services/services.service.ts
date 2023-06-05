import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesRepository } from './repositories/services.prisma.repository';
import { NotFoundError } from '../common/errors/not-found.error';

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
    return this.servicesRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.servicesRepository.findOne(id);
    if (!user) throw new NotFoundError('Serviço não encontrado.');
    return user;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    return this.servicesRepository.update(id, updateServiceDto);
  }

  async remove(id: string) {
    return this.servicesRepository.remove(id);
  }
}
