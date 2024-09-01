import { Expose } from 'class-transformer';
import { IsEmail, IsString, Matches, ValidateIf } from 'class-validator';

export class loginDto {
  /**
   * 用户名(用户名和邮箱只能一个可空)
   * @example shubuzuo
   */
  @ValidateIf((obj) => !obj.email)
  @IsString()
  @Expose()
  name?: string;

  /**
   * 邮箱(用户名和邮箱只能一个可空)
   * @example shubuzuo@gmail.com
   */
  @ValidateIf((obj) => !obj.name)
  @IsEmail()
  @IsString()
  @Expose()
  email?: string;

  /**
   * 密码
   * @example password
   */
  @IsString()
  @Expose()
  password!: string;
}

export class checkLoginDto {
  @ValidateIf((obj) => !obj.email)
  @IsString()
  @Matches(/^[a-zA-Z_-]{6,10}$/, {
    message: '用户名必须为6-10位的大小写字母，可以包含_和-',
  })
  @Expose()
  name?: string;

  @ValidateIf((obj) => !obj.name)
  @IsEmail()
  @IsString()
  @Expose()
  email?: string;

  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E])[A-Za-z\d\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]{6,20}$/,
    {
      message:
        '密码必须为6-20位，至少包含一个大写字母，一个小写字母，一个数字和一个标点符号, 标点符号为 ascii 码中的标点符号',
    },
  )
  @Expose()
  password!: string;
}
