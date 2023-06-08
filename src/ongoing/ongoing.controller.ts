import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { OngoingService } from './ongoing.service';
import { CreateOngoingDto } from './dto/create-ongoing.dto';

@ApiBearerAuth()
@ApiTags('ongoing')
@Controller('ongoing')
export class OngoingController {
  constructor(private readonly ongoingService: OngoingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: any,
    @Body() createOngoingDto: CreateOngoingDto,
  ) {
    return this.ongoingService.create(createOngoingDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('provider')
  async findAllProvider(@Request() req: any) {
    return this.ongoingService.findAllProvider(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('client')
  async findAllClient(@Request() req: any) {
    return this.ongoingService.findAllClient(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.ongoingService.findOne(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('finished/:id')
  async finished(@Request() req: any, @Param('id') id: string) {
    return this.ongoingService.finished(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('canceled/:id')
  async canceled(@Request() req: any, @Param('id') id: string) {
    return this.ongoingService.canceled(id, req.user.id);
  }
}
