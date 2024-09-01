import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { DELETE_WHEN_EMPTY_STR } from 'src/_decorator/delete-empty-str';

@Injectable()
export class DeleteWhenEmptyStrPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const needCheck = Reflect.getMetadata(
      DELETE_WHEN_EMPTY_STR,
      metatype.prototype,
    );
    for (const key in value) {
      const val = value[key];
      const needDelete =
        needCheck ||
        Reflect.getMetadata(DELETE_WHEN_EMPTY_STR, metatype.prototype, key);
      if (val === '' && needDelete) {
        delete value[key];
      }
    }
    return value;
  }

  private toValidate(metatype: unknown): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype as any);
  }
}
