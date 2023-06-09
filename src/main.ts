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
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RemoveFormattingPipe } from './common/pipes/remove-formatting.pipe';
import { TrimPipe } from './common/pipes/trim.pipe';
import { ConflictInterceptor } from './common/interceptors/conflict.interceptor';
import { PrismaInterceptor } from './common/interceptors/prisma.interceptor';
import { NotFoundInterceptor } from './common/interceptors/not-found.interceptor';
import { ForbiddenInterceptor } from './common/interceptors/forbidden.interceptor';
import { UnauthorizedInterceptor } from './common/interceptors/unauthorized.interceptor';

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

  // Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalPipes(new RemoveFormattingPipe());
  app.useGlobalPipes(new TrimPipe());

  // Interceptors
  app.useGlobalInterceptors(new ConflictInterceptor());
  app.useGlobalInterceptors(new PrismaInterceptor());
  app.useGlobalInterceptors(new NotFoundInterceptor());
  app.useGlobalInterceptors(new ForbiddenInterceptor());
  app.useGlobalInterceptors(new UnauthorizedInterceptor());

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
