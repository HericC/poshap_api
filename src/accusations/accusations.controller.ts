import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  UserJwt,
  UserRequest,
} from '../auth/decorators/user-request.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { AccusationsService } from './accusations.service';
import { CreateAccusationDto } from './dto/create-accusation.dto';

@ApiBearerAuth()
@ApiTags('accusations')
@Controller('accusations')
export class AccusationsController {
  constructor(private readonly accusationsService: AccusationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @UserRequest() user: UserJwt,
    @Body() createAccusationDto: CreateAccusationDto,
  ) {
    return this.accusationsService.create(createAccusationDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('accused')
  async findAllAccused(@UserRequest() user: UserJwt) {
    return this.accusationsService.findAllAccused(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('accuser')
  async findAllAccuser(@UserRequest() user: UserJwt) {
    return this.accusationsService.findAllAccuser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accusationsService.findOne(id);
  }
}
