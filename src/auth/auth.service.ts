import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/repositories/users.prisma.repository';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async login(user: User) {
    const payload = { sub: user.id, name: user.name };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOneByEmail(email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    return { ...user, password: undefined };
  }
}
