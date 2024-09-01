import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as path from 'path';
import configuration from 'src/config/configuration';
import { Env } from 'src/config/config';

const transports = {
  console: new winston.transports.Console({
    level: 'silly',
  }),
  logFile: new winston.transports.File({
    dirname: path.join(process.cwd(), 'logs'),
    filename: 'log.json',
    level: 'silly',
  }),
};

const getLogger = async () => {
  const config = configuration();
  // 如果是本地测试环境则启用 nest 风格的 log format
  if (config.env == Env.dev) {
    transports.console = new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(
        winston.format.timestamp({
          format: () =>
            new Date().toLocaleString('chinese', {
              timeZone: 'Asia/Shanghai',
              hour12: false,
            }),
        }),
        nestWinstonModuleUtilities.format.nestLike(config.appName),
      ),
    });
  }
  const logger = WinstonModule.createLogger({
    transports: [transports.console, transports.logFile],
    level: 'silly',
  });
  return logger;
};

export default getLogger;
