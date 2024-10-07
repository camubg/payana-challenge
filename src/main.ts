import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

async function bootstrap() {
  const logger = new Logger();
  const port = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('This is the API documentation for my PayanaChallenge app')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  logger.log(`Application listening on port ${port}`);

  await app.listen(port);
}
bootstrap();
