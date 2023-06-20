import { Injectable } from '@nestjs/common';
import { CreateProviderRatingDto } from './dto/create-provider-rating.dto';
import { CreateClientRatingDto } from './dto/create-client-rating.dto';
import { ProviderRatingsRepository } from './repositories/provider-ratings.prisma.repository';
import { ClientRatingsRepository } from './repositories/client-ratings.prisma.repository';
import { ForbiddenError } from '../common/errors/forbidden.error';

@Injectable()
export class RatingsService {
  constructor(
    private readonly providerRatingsRepository: ProviderRatingsRepository,
    private readonly clientRatingsRepository: ClientRatingsRepository,
  ) {}

  async createProvider(
    createRatingDto: CreateProviderRatingDto,
    userId: string,
  ) {
    if (createRatingDto.userId === userId)
      throw new ForbiddenError('Não pode avaliar a se próprio');

    return this.providerRatingsRepository.create(createRatingDto);
  }

  async createClient(createRatingDto: CreateClientRatingDto, userId: string) {
    if (createRatingDto.userId === userId)
      throw new ForbiddenError('Não pode avaliar a se próprio');

    return this.clientRatingsRepository.create(createRatingDto);
  }

  async averageRatings(userId: string) {
    const averageProviderRating =
      await this.providerRatingsRepository.averageRating(userId);

    const averageClientRating =
      await this.clientRatingsRepository.averageRating(userId);

    return {
      providerRating: averageProviderRating._avg.providerRating,
      serviceRating: averageProviderRating._avg.serviceRating,
      clientRating: averageClientRating._avg.rating,
    };
  }
}
