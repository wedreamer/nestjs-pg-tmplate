import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidateIf,
} from 'class-validator';

export enum Env {
  dev = 'dev',
  pro = 'pro',
}

export class db {
  @IsString()
  host!: string;

  @IsNumber()
  port!: number;

  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsString()
  database!: string;
}

export class Security {
  @IsString()
  jwtKey!: string;

  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  @IsOptional()
  @ValidateIf((_, val) => typeof val === 'number')
  @IsNumber()
  @ValidateIf((_, val) => typeof val === 'string')
  @IsString()
  jwtExpiresIn?: number = 30 * 60;
}

export class Config {
  @IsOptional()
  @IsEnum(Env)
  env: Env = Env.dev;

  @IsOptional()
  @IsString()
  appName: string = 'zhengjue-ebook-server';

  @Validate(() => Security)
  security!: Security;

  @Validate(() => db)
  db!: db;
}
