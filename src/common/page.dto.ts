import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
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

export class PaginationRes {
  total!: number;
  current!: number;
  pageSize!: number;
}

export class PageRes {
  pagination!: PaginationRes;
}

export const ApiPageRes = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(PageRes, model),
    ApiOkResponse({
      schema: {
        title: `PageResOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PageRes) },
          {
            properties: {
              list: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
