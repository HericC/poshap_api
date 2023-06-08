import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../dto/jwt-payload.dto';

export type UserJwt = {
  id: string;
  name: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiretion: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<UserJwt> {
    return { id: jwtPayload.sub, name: jwtPayload.name };
  }
}
