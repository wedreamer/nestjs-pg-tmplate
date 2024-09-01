import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Describe } from 'src/_decorator/describe';
import { CurrentUser } from 'src/_decorator/user';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ListRes } from 'src/common/page.dto';
import { RoleService } from './role.service';
import { queryList } from './dto/list.dto';
import { createRoleDto } from './dto/create.dto';
import { updateRoleDto } from './dto/update.dto';
import { PermissionGuard } from 'src/auth/guard/auth.guard';
import { UserDomain } from 'src/user/domain/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@app/db/entity/role.entity';
import { Repository } from 'typeorm';
import { User } from '@app/db/entity/user.entity';
import { DeleteWhenEmptyStrPipe } from 'src/_pipe/emptyStr';

/**
 * 角色管理
 */
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
@Controller('role')
@Describe('角色管理')
export class RoleController {
  constructor(
    @InjectRepository(Role)
    private readonly repo: Repository<Role>,
    private readonly service: RoleService,
  ) {}

  /**
   * 获取单个角色
   * @param id 角色 id
   * @param user 当前用户
   * @returns 角色
   */
  @Get(':id')
  @Describe('获取单个角色')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Role> {
    const res = await this.service.findById(id, user);
    if (res) return res;
    throw new BadRequestException();
  }

  /**
   * 获取角色列表
   * @param dto 查询参数
   * @param user 当前用户
   * @returns 列表结果
   */
  @Get()
  @Describe('获取角色列表')
  async list(
    @Query() dto: queryList,
    @CurrentUser() user: User,
  ): Promise<ListRes<Role>> {
    const { current, pageSize } = dto;
    const { data, total } = await this.service.list(dto, user);
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
   * 新增角色
   * @param dto 新增角色参数
   * @param user 当前用户
   * @returns 新增角色
   */
  @Post()
  @Describe('新增角色')
  async create(
    @Body() dto: createRoleDto,
    @CurrentUser() user: User,
  ): Promise<Role> {
    const ok = await this.service.validate(dto, user);
    if (!ok) throw new ForbiddenException();
    const domain = new UserDomain(user);
    const role = this.repo.create({
      ...dto,
      tiers: domain.minTiers() + 1,
    });
    await role.save({ reload: true });
    return role;
  }

  /**
   * 删除角色
   * @param id 角色 id
   * @param user 当前用户
   * @returns void
   */
  @Delete(':id')
  @Describe('删除角色')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    const res = await this.repo.findOneBy({ id });
    if (res) {
      const tiers = res.tiers;
      const myTiers = new UserDomain(user).minTiers();
      if (myTiers < tiers) {
        await this.repo.delete(res.id);
        return;
      }
      throw new ForbiddenException();
    }
    throw new BadRequestException('角色不存在');
  }

  /**
   * 更新角色
   * @param id 角色 id
   * @param dto 更新内容
   * @param user 当前用户
   * @returns 更新后的角色
   */
  @Patch(':id')
  @Describe('更新角色')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(DeleteWhenEmptyStrPipe) dto: updateRoleDto,
    @CurrentUser() user: User,
  ): Promise<Role> {
    const ok = await this.service.validate(dto, user);
    if (ok) {
      const one = await this.repo.findOneBy({ id });
      if (one) {
        await this.repo.update({ id }, dto);
        await one.reload();
        return one;
      }
      throw new BadRequestException('用户不存在');
    }
    throw new ForbiddenException();
  }
}
