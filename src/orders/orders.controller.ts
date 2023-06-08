import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRequest } from '../auth/decorators/user-request.decorator';
import { UserJwt } from '../auth/strategies/jwt.strategy';
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
  async create(
    @UserRequest() user: UserJwt,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(createOrderDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('provider')
  async findAllProvider(@UserRequest() user: UserJwt) {
    return this.ordersService.findAllProvider(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('client')
  async findAllClient(@UserRequest() user: UserJwt) {
    return this.ordersService.findAllClient(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@UserRequest() user: UserJwt, @Param('id') id: string) {
    return this.ordersService.findOne(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@UserRequest() user: UserJwt, @Param('id') id: string) {
    return this.ordersService.remove(id, user.id);
  }
}
