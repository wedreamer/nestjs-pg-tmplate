import { SetMetadata } from '@nestjs/common';

export enum interfaceType {
  // 只要登录就具有的权限
  LOGIN = 'LOGIN',
  // 需要赋予
  NEEDACCEPT = 'NEEDACCEPT',
}

type DescribeProp =
  | {
      showName: string;
      type?: interfaceType;
    }
  | string;

export const DESCRIBE_KEY = 'describe';
export const Describe = (
  prop: DescribeProp,
  type: interfaceType = interfaceType.LOGIN,
) => {
  if (typeof prop !== 'string') prop.type = type;
  return SetMetadata(DESCRIBE_KEY, typeof prop === 'string' ? prop : prop);
};
