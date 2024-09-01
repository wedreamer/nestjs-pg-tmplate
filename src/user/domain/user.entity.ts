import { Role } from '@app/db/entity/role.entity';
import { User } from '@app/db/entity/user.entity';

export class UserDomain {
  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  public isRoot() {
    return this.user.initRoot;
  }

  public minTiers() {
    if (this.user.roles.length)
      return (this.user.roles as Role[])
        .map((i) => i.tiers)
        .reduce((a, b) => {
          return Math.min(a, b);
        });
    return Number.MAX_VALUE;
  }
}
