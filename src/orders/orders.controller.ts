import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiBearerAuth()
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('provider')
  async findAllProvider(@Request() req: any) {
    return this.ordersService.findAllProvider(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('client')
  async findAllClient(@Request() req: any) {
    return this.ordersService.findAllClient(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.ordersService.findOne(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.ordersService.remove(id, req.user.id);
  }
}
