import { Expose } from 'class-transformer';
import { ArrayMinSize, IsOptional, IsString } from 'class-validator';

export class createRoleDto {
  @IsString()
  @Expose()
  name!: string;

  @IsOptional()
  @IsString()
  @Expose()
  describe?: string;

  @ArrayMinSize(1)
  @IsString({ each: true })
  @Expose()
  permissions!: string[];
}
