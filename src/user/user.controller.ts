import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { createUserDto } from './dto/create.dto';
import { hash } from 'src/util/hash';
import { queryUserList } from './dto/list.dto';
import { ListRes } from 'src/common/page.dto';
import { Describe } from 'src/_decorator/describe';
import { updateUserDto } from './dto/update.dto';
import { PermissionGuard } from 'src/auth/guard/auth.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { DeleteWhenEmptyStrPipe } from 'src/_pipe/emptyStr';
import { User } from '@app/db/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * 用户管理
 */
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('user')
@Describe('用户管理')
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  /**
   * 获取某个用户
   * @param id 用户 id
   * @returns 用户
   */
  @Get(':id')
  @Describe('获取单个用户')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const res = await this.repo.findOneBy({ id });
    if (res) {
      return res;
    }
    throw new BadRequestException('用户不存在');
  }

  /**
   * 获取用户列表
   * @param dto 查询列表
   * @returns 用户列表
   */
  @Get()
  @Describe('获取用户列表')
  async list(@Query() dto: queryUserList): Promise<ListRes<User>> {
    const { current, pageSize } = dto;
    const where = dto.toFilter();
    const [total, data] = await Promise.all([
      await this.repo.countBy(where),
      await this.repo.find({
        where,
        skip: (current - 1) * pageSize,
        take: pageSize,
        relations: { roles: true },
        order: { updated: 'DESC' },
      }),
    ]);
    return {
      list: data,
      pagination: {
        total,
        current,
        pageSize,
      },
    };
  }

  /**
   * 新增用户
   * @param dto 新增用户参数
   * @returns 用户
   */
  @Post()
  @Describe('新增用户')
  async create(@Body() dto: createUserDto): Promise<User> {
    dto.password = await hash(dto.password);
    // TODO: 使用其他方式避免
    const count = await this.repo.countBy({});
    const user = this.repo.create({
      ...dto,
      initRoot: !count,
    });
    await user.save({ reload: true });
    return user;
  }

  /**
   * 删除用户
   * @param id 用户 id
   * @returns void
   */
  @Delete(':id')
  @Describe('删除用户')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const one = await this.repo.findOneBy({ id });
    if (one) {
      await this.repo.delete(one.id);
      return;
    }
    throw new BadRequestException('用户不存在');
  }

  /**
   * 更新用户
   * @param id 用户 id
   * @param dto 更新内容
   * @returns 更新后的用户
   */
  @Patch(':id')
  @Describe('更新用户')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(DeleteWhenEmptyStrPipe) dto: updateUserDto,
  ): Promise<User> {
    if (Object.keys(dto).length > 0) {
      const one = await this.repo.findOneBy({ id });
      if (!one) throw new BadRequestException();
      // 更新密码
      const { roles, ...basicInfo } = dto;
      if (dto.password) {
        const hashPassword = await hash(dto.password);
        await this.repo.update(
          { id },
          {
            ...basicInfo,
            password: hashPassword,
          },
        );
      } else {
        // 更新其他信息
        await this.repo.update({ id }, basicInfo);
      }
      await one.reload();
      return one;
    }
    throw new BadRequestException();
  }
}
