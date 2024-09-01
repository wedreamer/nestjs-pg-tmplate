import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  // swagger
  const config = new DocumentBuilder()
    .setTitle('openapi')
    .setDescription('ebook 后端 api')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey.split('Controller')[0]}_${methodKey}`,
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
