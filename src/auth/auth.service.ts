import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersRepository } from '../users/repositories/users.prisma.repository';
import { JwtPayload } from './dto/jwt-payload.dto';
import { UserJwt } from './decorators/user-request.decorator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOneByEmail(email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    return { ...user, password: undefined };
  }

  async validateJwt(jwtPayload: JwtPayload): Promise<UserJwt> {
    const userJwt = { id: jwtPayload.sub, email: jwtPayload.email };

    const user = await this.usersRepository.findOne(userJwt.id);
    if (!user || user.email !== userJwt.email) return null;

    return userJwt;
  }
}
