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
import { UserRequest } from '../auth/decorators/user-request.decorator';
import { UserJwt } from '../auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@ApiBearerAuth()
@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @UserRequest() user: UserJwt,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    return this.servicesService.create(createServiceDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.servicesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @UserRequest() user: UserJwt,
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, updateServiceDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@UserRequest() user: UserJwt, @Param('id') id: string) {
    return this.servicesService.remove(id, user.id);
  }
}
