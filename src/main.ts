import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import getLogger from './logger';
import * as dayjs from 'dayjs';

dayjs.locale('zh-cn');

async function bootstrap() {
  const logger = await getLogger();
  const app = await NestFactory.create(AppModule, { logger });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        strategy: 'excludeAll',
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      },
    }),
  );
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
