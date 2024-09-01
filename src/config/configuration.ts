import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { Config } from './config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

const YAML_CONFIG_FILENAME = 'config.yml';

let config: Config | undefined;

export default () => {
  if (config) return config;
  const configData = yaml.load(
    readFileSync(join(process.cwd(), YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
  // transform and valiate
  const target = plainToInstance(Config, configData);
  const error = validateSync(target);
  if (error.length > 0) {
    throw new Error(error.map((err) => err.toString(true)).join('\n'));
  } else {
    config = target;
    return target;
  }
};
