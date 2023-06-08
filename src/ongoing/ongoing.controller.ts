import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { OngoingService } from './ongoing.service';
import { CreateOngoingDto } from './dto/create-ongoing.dto';

@ApiBearerAuth()
@ApiTags('ongoing')
@Controller('ongoing')
export class OngoingController {
  constructor(private readonly ongoingService: OngoingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createOngoingDto: CreateOngoingDto) {
    return this.ongoingService.create(createOngoingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.ongoingService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ongoingService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('finished/:id')
  async finished(@Param('id') id: string) {
    return this.ongoingService.finished(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('canceled/:id')
  async canceled(@Param('id') id: string) {
    return this.ongoingService.canceled(id);
  }
}
