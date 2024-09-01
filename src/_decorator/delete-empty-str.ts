import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ValidateIf } from 'class-validator';

export const DELETE_WHEN_EMPTY_STR = 'DeleteWhenEmptyStr';

export function DeleteWhenEmptyStr() {
  return applyDecorators(
    ValidateIf((_, val) => val !== ''),
    SetMetadata(DELETE_WHEN_EMPTY_STR, true),
  );
}
