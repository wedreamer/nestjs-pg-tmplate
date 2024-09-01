import { User } from '@app/db/entity/user.entity';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { pageDto } from 'src/common/page.dto';
import { FindOptionsWhere } from 'typeorm';

export class queryUserList extends pageDto {
  /**
   * 用户名
   * @example shubuzuo
   * @description 最小六位, 最大十位, 大小写字母, 不允许包含特殊字符, 允许 _ 和 -
   */
  @IsOptional()
  @ValidateIf((_, val) => val !== '')
  @IsString()
  @Matches(/^[a-zA-Z_-]{6,10}$/, {
    message: '用户名必须为6-10位的大小写字母，可以包含_和-',
  })
  @Expose()
  name?: string;

  @IsOptional()
  @ValidateIf((_, val) => val !== '')
  @IsString()
  @Length(0, 10)
  @Expose()
  nickName?: string;

  @IsOptional()
  @ValidateIf((_, val) => val !== '')
  @IsEmail()
  @Expose()
  email?: string;

  @IsOptional()
  @ValidateIf((_, val) => val !== '')
  @IsPhoneNumber('CN')
  @Expose()
  phoneNum?: string;

  public toFilter(): FindOptionsWhere<User> | FindOptionsWhere<User>[] {
    const filter: FindOptionsWhere<User> = {};
    if (this.name) filter.name = this.name;
    if (this.nickName) filter.nickName = this.nickName;
    if (this.email) filter.email = this.email;
    if (this.phoneNum) filter.phoneNum = this.phoneNum;
    return filter;
  }
}
