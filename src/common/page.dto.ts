import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { IsPageCurrent, IsPagePageSize } from 'src/_decorator/is-page';

export class ListRes<T> {
  list!: T[];
  pagination!: PaginationRes;
}

export class pageDto {
  // number or number str
  @IsOptional()
  @IsPagePageSize({ max: 1000, min: 10 })
  @Expose()
  pageSize: number = 10;

  // number or number str
  @IsOptional()
  @IsPageCurrent()
  @Expose()
  current: number = 1;

  public getExtendInfo(): PaginationExtend {
    return {
      skip: (this.current - 1) * this.pageSize,
      take: this.pageSize,
    };
  }
}

export interface PaginationExtend {
  skip: number;
  take: number;
}

export type PaginationRes = {
  total: number;
} & Pick<pageDto, 'current'> &
  Pick<pageDto, 'pageSize'>;
