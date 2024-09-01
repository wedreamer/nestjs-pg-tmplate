import { Expose } from 'class-transformer';
import { IsString, IsOptional, ArrayMinSize } from 'class-validator';
import { DeleteWhenEmptyStr } from 'src/_decorator/delete-empty-str';

export class updateRoleDto {
  @DeleteWhenEmptyStr()
  @IsOptional()
  @IsString()
  @Expose()
  name?: string;

  @DeleteWhenEmptyStr()
  @IsOptional()
  @IsString()
  @Expose()
  describe?: string;

  @IsOptional()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @Expose()
  permissions?: string[];
}
