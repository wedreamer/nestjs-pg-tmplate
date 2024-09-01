import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';

export class changeLoginInfoDto {
  // 最小六位, 最大十位, 大小写字母, 不允许包含特殊字符, 允许 _ 和 -
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z_-]{6,10}$/, {
    message: '用户名必须为6-10位的大小写字母，可以包含_和-',
  })
  @Expose()
  name?: string;

  @IsOptional()
  @IsEmail()
  @Expose()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('CN')
  @Expose()
  phoneNum?: string;

  // 密码必须为6-20位，至少包含一个大写字母，一个小写字母，一个数字和一个标点符号, 标点符号为 ascii 码中的标点符号
  @IsOptional()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E])[A-Za-z\d\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]{6,20}$/,
    {
      message:
        '密码必须为6-20位，至少包含一个大写字母，一个小写字母，一个数字和一个标点符号, 标点符号为 ascii 码中的标点符号',
    },
  )
  @Expose()
  password?: string;
}
