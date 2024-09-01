import {
  registerDecorator,
  ValidationOptions,
  isNumberString,
} from 'class-validator';

export function IsPageCurrent(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isPageCurrent',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string | number) {
          if (typeof value === 'string') {
            return isNumberString(value);
          }
          if (typeof value === 'number') {
            return true;
          }
          return false;
        },
      },
    });
  };
}

export function IsPagePageSize(
  property: { max: number; min: number },
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isPagePageSize',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string | number) {
          if (typeof value === 'string') {
            return (
              isNumberString(value) &&
              parseInt(value) <= property.max &&
              parseInt(value) >= property.min
            );
          }
          if (typeof value === 'number') {
            return value >= property.min && value <= property.max;
          }
          return false;
        },
      },
    });
  };
}
