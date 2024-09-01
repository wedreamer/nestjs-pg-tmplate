import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class loginResDto {
  /**
   * access_token
   * @example xxxx.xxxx.xxxx
   */
  @IsString()
  @Expose()
  access_token!: string;
}
