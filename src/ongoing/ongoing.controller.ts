import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  UserJwt,
  UserRequest,
} from '../auth/decorators/user-request.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { OngoingService } from './ongoing.service';
import { CreateOngoingDto } from './dto/create-ongoing.dto';
import { FilterOngoingDto } from './dto/filter-ongoing.dto';

@ApiBearerAuth()
@ApiTags('ongoing')
@Controller('ongoing')
export class OngoingController {
  constructor(private readonly ongoingService: OngoingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @UserRequest() user: UserJwt,
    @Body() createOngoingDto: CreateOngoingDto,
  ) {
    return this.ongoingService.create(createOngoingDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('provider')
  async findAllProvider(
    @UserRequest() user: UserJwt,
    @Query() query: FilterOngoingDto,
  ) {
    return this.ongoingService.findAllProvider(query, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('client')
  async findAllClient(
    @UserRequest() user: UserJwt,
    @Query() query: FilterOngoingDto,
  ) {
    return this.ongoingService.findAllClient(query, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('cancellationScore/:userid')
  async cancellationScore(@Param('userid') userId: string) {
    return this.ongoingService.cancellationScore(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@UserRequest() user: UserJwt, @Param('id') id: string) {
    return this.ongoingService.findOne(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('finished/:id')
  async finished(@UserRequest() user: UserJwt, @Param('id') id: string) {
    return this.ongoingService.finished(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('canceled/:id')
  async canceled(@UserRequest() user: UserJwt, @Param('id') id: string) {
    return this.ongoingService.canceled(id, user.id);
  }
}
