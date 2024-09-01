import { Role } from '@app/db/entity/role.entity';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { pageDto } from 'src/common/page.dto';
import { FindOptionsWhere } from 'typeorm';

export class queryList extends pageDto {
  @IsOptional()
  @ValidateIf((_, val) => val !== '')
  @IsString()
  @Expose()
  name?: string;

  public toFilter(): FindOptionsWhere<Role> | FindOptionsWhere<Role>[] {
    const filter: FindOptionsWhere<Role> = {};
    if (this.name) filter.name = this.name;
    return filter;
  }
}
