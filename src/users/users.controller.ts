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

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @UserRequest() user: UserJwt,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-plan/:key')
  async updatePlan(@UserRequest() user: UserJwt, @Param('key') key: string) {
    return this.usersService.updatePlan(user.id, key);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@UserRequest() user: UserJwt, @Param('id') id: string) {
    return this.usersService.remove(id, user.id);
  }
}
