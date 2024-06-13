import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Pipe 유효성 검사
  app.useGlobalPipes(new ValidationPipe());
  // 쿠키 파서
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
