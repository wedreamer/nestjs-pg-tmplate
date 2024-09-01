import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { loginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { CurrentUser } from 'src/_decorator/user';
import { loginResDto } from './dto/login-res.dto';
import { Describe } from 'src/_decorator/describe';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/db/entity/user.entity';

/**
 * 身份验证
 */
@Controller('auth')
@Describe('身份认证')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  /**
   * 根据用户名或者邮箱和密码进行登录
   * @param dto 登录, username 和 email 其中一个可空
   * @returns access_token
   */
  @Post()
  @Describe('登录')
  async login(@Body() dto: loginDto): Promise<loginResDto> {
    const pass = await this.service.checkDto(dto);
    if (!pass) throw new UnauthorizedException('登录失败!');
    const user = await this.service.findOne({
      username: dto.name,
      email: dto.email,
    } as
      | {
          username: string;
          email?: never;
        }
      | {
          username?: never;
          email: string;
        });
    if (user) {
      const res = await this.service.signIn(user, dto.password);
      if (!res) throw new UnauthorizedException('登录失败!');
      return res;
    }
    throw new UnauthorizedException('登录失败!');
  }

  /**
   * 获取个人信息
   * @param user 当前用户
   * @returns 当前用户的个人信息
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @Describe('获取个人信息')
  async getProfile(@CurrentUser() user: User): Promise<User> {
    const res = await this.repo.findOne({
      where: { id: user.id },
      relations: { roles: true },
    });
    return res as User;
  }
}
