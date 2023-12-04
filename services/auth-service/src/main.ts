import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exception/custom-exception.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 8001,
    },
  });

  await app.startAllMicroservices();
  app.setGlobalPrefix('api/v1');
  app.enableCors({ origin: true, methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' });
  app.useGlobalPipes(new ValidationPipe());
  app.use(passport.initialize());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
