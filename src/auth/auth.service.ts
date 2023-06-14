import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersRepository } from '../users/repositories/users.prisma.repository';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { OtgCodeDto } from './dto/otg-code.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtPayload } from './dto/jwt-payload.dto';
import { UserJwt } from './decorators/user-request.decorator';
import { MailService } from '../mail/mail.service';
import { DatabaseError } from '../common/errors/database.error';
import { ConflictError } from '../common/errors/conflict.error';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.usersRepository.findOneByEmail(email);

    if (user) {
      let otgCode = `${Math.random()}`.slice(-6);
      while (true) {
        const user = await this.usersRepository.findOneByOtgCode(otgCode);
        if (user) otgCode = `${Math.random()}`.slice(-6);
        else break;
      }

      const forgotPasswordExpires = new Date();
      forgotPasswordExpires.setHours(forgotPasswordExpires.getHours() + 4);

      await this.usersRepository.update(user.id, {
        forgotPasswordOtgCode: otgCode,
        forgotPasswordExpires,
      });

      this.mailService.sendMail({
        to: user.email,
        subject: 'Poshap - Código de recuperação de senha',
        template: 'forgot-password',
        context: { otgCode },
      });
    }

    return {
      message:
        'Caso o e-mail esteja em nossa base de dados será enviado as instruções de recuperação.',
    };
  }

  async validateOtgCode({ otgCode }: OtgCodeDto, http = true) {
    const user = await this.usersRepository.findOneByOtgCode(otgCode);
    if (!user) throw new DatabaseError('Código infomado inválido.');

    const currentDate = new Date();
    if (currentDate > user.forgotPasswordExpires)
      throw new DatabaseError('Código infomado inválido.');

    return http ? { message: 'Código infomado válido.' } : user;
  }

  async changePassword({ otgCode, password }: ChangePasswordDto) {
    const user = (await this.validateOtgCode({ otgCode }, false)) as User;

    const match = await bcrypt.compare(password, user.password);
    if (match)
      throw new ConflictError(
        'A nova senha não pode ser igual a senha antiga.',
      );

    const hash = await bcrypt.hash(password, 8);
    await this.usersRepository.update(user.id, {
      forgotPasswordOtgCode: null,
      forgotPasswordExpires: null,
      password: hash,
    });

    this.mailService.sendMail({
      to: user.email,
      subject: 'Poshap - Senha alterada',
      template: 'change-password',
      context: { email: this.config.get('MAIL_SUPPORT') },
    });

    return { message: 'Senha alterada com sucesso.' };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOneByEmail(email);
    const blockDate = user.blockDate && user.blockDate > new Date();
    if (!user || blockDate) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    return { ...user, password: undefined };
  }

  async validateJwt(jwtPayload: JwtPayload): Promise<UserJwt> {
    const userJwt = { id: jwtPayload.sub, email: jwtPayload.email };

    const user = await this.usersRepository.findOne(userJwt.id);
    const blockDate = user.blockDate && user.blockDate > new Date();
    if (!user || blockDate || user.email !== userJwt.email) return null;

    return userJwt;
  }
}
