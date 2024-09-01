import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import configuration from 'src/config/configuration';
import JwtPayload from '../type/jwt-payload';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/db/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {
    const jwtKey = configuration().security.jwtKey;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtKey,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.repo
      .createQueryBuilder('user')
      .where('user.id = :id', { id: payload.sub })
      .addSelect('user.initRoot')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('user.org', 'org')
      .getOne();
    // findOne({
    //   where: { id: payload.sub },
    //   select: { initRoot: true },
    //   relations: { roles: true, org: true },
    // });
    return user;
  }
}
