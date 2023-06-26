import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  UserJwt,
  UserRequest,
} from '../auth/decorators/user-request.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { RatingsService } from './ratings.service';
import { CreateProviderRatingDto } from './dto/create-provider-rating.dto';
import { CreateClientRatingDto } from './dto/create-client-rating.dto';

@ApiBearerAuth()
@ApiTags('ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('provider')
  async createProvider(
    @UserRequest() user: UserJwt,
    @Body() createRatingDto: CreateProviderRatingDto,
  ) {
    return this.ratingsService.createProvider(createRatingDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('client')
  async createClient(
    @UserRequest() user: UserJwt,
    @Body() createRatingDto: CreateClientRatingDto,
  ) {
    return this.ratingsService.createClient(createRatingDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('average/:id')
  async averageRatings(@Param('id') id: string) {
    return this.ratingsService.averageRatings(id);
  }
}
