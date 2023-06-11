import { Injectable } from '@nestjs/common';
import { CreateAccusationDto } from './dto/create-accusation.dto';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { AccusationsRepository } from './repositories/accusations.prisma.repository';
import { ForbiddenError } from 'src/common/errors/forbidden.error';

@Injectable()
export class AccusationsService {
  constructor(private readonly accusationsRepository: AccusationsRepository) {}

  create(createAccusationDto: CreateAccusationDto, userId: string) {
    if (createAccusationDto.accusedId === userId)
      throw new ForbiddenError('Não pode denunciar a se próprio.');

    return this.accusationsRepository.create({
      ...createAccusationDto,
      accuserId: userId,
    });
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
