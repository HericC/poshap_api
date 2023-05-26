import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import helmet from 'helmet';

import { AppModule } from './app.module';
import { TrimPipe } from './common/pipes/TrimPipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const APP_NAME = configService.get('APP_NAME');
  const APP_VERSION = configService.get('APP_VERSION');
  const APP_DOCS_PATH = configService.get('APP_DOCS_PATH') || 'doc';
  const APP_URL = configService.get('APP_URL');
  const APP_PORT = configService.get('APP_PORT') || 3000;

  // Security
  app.use(helmet());
  app.enableCors({
    origin: APP_NAME || '*',
  });

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalPipes(new TrimPipe());

  // Swagger
  const appName = APP_NAME;
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(appName)
    .setDescription(`This a API documentation to ${appName}`)
    .setVersion(APP_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const customOptions: SwaggerCustomOptions = {
    explorer: false,
    customSiteTitle: APP_NAME,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: '',
    },
  };
  SwaggerModule.setup(APP_DOCS_PATH, app, document, customOptions);

  // Start server
  await app.listen(APP_PORT, () => {
    const url = APP_URL || `http://localhost:${APP_PORT}`;
    console.log(`Running API: ${url}`);
    console.log(`Running DOC: ${url}/${APP_DOCS_PATH}`);
  });
}

bootstrap();
