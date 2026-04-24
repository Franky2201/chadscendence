import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  // If you intended the built-in Nest CORS support:
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
