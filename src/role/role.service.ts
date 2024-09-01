import { BadRequestException, Injectable } from '@nestjs/common';
import { queryList } from './dto/list.dto';
import { createRoleDto } from './dto/create.dto';
import { updateRoleDto } from './dto/update.dto';
import { UserDomain } from 'src/user/domain/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission, Role } from '@app/db/entity/role.entity';
import { FindOptionsWhere, LessThanOrEqual, Repository } from 'typeorm';
import { User } from '@app/db/entity/user.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly repo: Repository<Role>,
  ) {}

  async findById(id: number, user: User) {
    const userDomain = new UserDomain(user);
    const isRoot = userDomain.isRoot();
    const minTiers = userDomain.minTiers();
    if (isRoot) {
      const res = await this.repo.findOneBy({ id });
      return res;
    } else {
      const res = await this.repo.findOneBy({
        id,
        tiers: LessThanOrEqual(minTiers),
      });
      // TODO: 可能已经被删除, 非法, 可能无权限
      if (!res) throw new BadRequestException();
      return res;
    }
  }

  async list(
    dto: queryList,
    user: User,
  ): Promise<{ total: number; data: Role[] }> {
    const userDomain = new UserDomain(user);
    const isRoot = userDomain.isRoot;
    const minTiers = userDomain.minTiers();
    const { current, pageSize } = dto;
    const where = dto.toFilter();
    if (!isRoot) {
      (where as FindOptionsWhere<Role>).tiers = LessThanOrEqual(minTiers);
    }
    const [total, data] = await Promise.all([
      await this.repo.countBy(where),
      await this.repo.find({
        where,
        skip: (current - 1) * pageSize,
        take: pageSize,
        order: { updated: 'DESC' },
      }),
    ]);
    return {
      total,
      data,
    };
  }

  async validate(
    dto: createRoleDto | updateRoleDto,
    user: User,
  ): Promise<boolean> {
    if (user.initRoot) return true;
    const permissions = dto.permissions ?? [];
    const hasPermissions: Permission[] = [...user.permissions];
    user.roles!.forEach((role) =>
      hasPermissions.push(...(role as Role).permissions),
    );
    if (hasPermissions.length < permissions.length) {
      return false;
    }
    const illegalItems = permissions.filter((i) => hasPermissions.includes(i));
    if (illegalItems.length) return false;
    return true;
  }
}
