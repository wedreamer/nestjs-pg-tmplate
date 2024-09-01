import { Injectable } from '@nestjs/common';
import { checkLoginDto, loginDto } from './dto/login.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import JwtPayload from './type/jwt-payload';
import { User } from '@app/db/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'src/util/hash';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async checkDto(dto: loginDto): Promise<boolean> {
    const { name, email } = dto;
    if (name || email) {
      const checkObj = plainToInstance<checkLoginDto, loginDto>(
        checkLoginDto,
        dto,
        {
          strategy: 'excludeAll',
          enableImplicitConversion: true,
          excludeExtraneousValues: true,
        },
      );
      const errors = await validate(checkObj);
      if (errors.length > 0) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  async findOne(
    userNameOrEmail:
      | {
          username: string;
          email?: never;
        }
      | {
          username?: never;
          email: string;
        },
  ): Promise<User | null> {
    const { username, email } = userNameOrEmail;
    if (username) {
      const res = await this.repo
        .createQueryBuilder('user')
        .where('user.name = :username', { username })
        .addSelect('user.password')
        .getOne();

      return res;
    }
    if (email) {
      const res = await this.repo
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .addSelect('user.password')
        .getOne();

      return res;
    }
    // 不可能走到
    return null;
  }

  async signIn(
    user: User,
    plainPassword: string,
  ): Promise<{ access_token: string } | null> {
    // 散列之后
    const pass = compare(plainPassword, user.password);
    if (!pass) {
      return null;
    }
    const payload: JwtPayload = { sub: user.id, username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
