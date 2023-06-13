import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  UserJwt,
  UserRequest,
} from '../auth/decorators/user-request.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('plans')
  async findAllPlans() {
    return this.usersService.findAllPlans();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findOneJwt(@UserRequest() user: UserJwt) {
    return this.usersService.findOne(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOnePublic(@Param('id') id: string) {
    return this.usersService.findOnePublic(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(
    @UserRequest() user: UserJwt,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(updateUserDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-plan')
  async updatePlan(
    @UserRequest() user: UserJwt,
    @Body() UpdatePlanDto: UpdatePlanDto,
  ) {
    return this.usersService.updatePlan(UpdatePlanDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(@UserRequest() user: UserJwt) {
    return this.usersService.remove(user.id);
  }
}
