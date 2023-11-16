import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { log } from 'console';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    //console.log('......=>>>>>>>>>>>>>>>>>>>>>>>', payload, payload.email);
    return { _id: payload.sub, email: payload.email, name: payload.name };
  }
}
