import { Role } from '@app/db/entity/role.entity';
import { User } from '@app/db/entity/user.entity';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class PermissionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const key = `${context.getClass()}/${context.getHandler()}`;
    const request = context.switchToHttp().getRequest();
    const { user } = request as { user: User };
    if (user.initRoot) return true;
    const hasPermissions = [...user.permissions];
    (user.roles as Role[]).forEach((role) =>
      hasPermissions.push(...(role as Role).permissions),
    );
    return hasPermissions.includes(key);
  }
}
