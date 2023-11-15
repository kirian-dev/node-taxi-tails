// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './configs/logger.config';
import { config } from './configs/config';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import { HttpExceptionFilter } from './common/exception/custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('Taxi-Tails API Documentation')
    .setDescription('The taxi-tails NODE REST API documentation')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('сars')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port || 3000);
}

bootstrap();
