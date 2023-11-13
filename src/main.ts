// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './configs/logger.config';
import { config } from './configs/config';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import { HttpExceptionFilter } from './common/exception/custom-exception.filter';

const { port } = config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  });

  app.setGlobalPrefix('api/v1');
  app.enableCors({ origin: true, methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' });
  app.useGlobalPipes(new ValidationPipe());
  app.use(passport.initialize());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port || 3000);
}

bootstrap();
