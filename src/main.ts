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
import { SeedsService } from './seeds/seeds.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const APP_NAME = configService.get('APP_NAME') || 'Poshap';
  const APP_VERSION = configService.get('APP_VERSION') || '1.0.0';
  const APP_PORT = configService.get('APP_PORT') || 3000;
  const APP_URL =
    configService.get('APP_URL') || `http://localhost:${APP_PORT}`;
  const APP_DOCS_PATH = configService.get('APP_DOCS_PATH') || 'doc';
  const APP_CORS_PATH = configService.get('APP_CORS_PATH') || '*';

  // Security
  app.use(helmet());
  app.enableCors({
    origin: APP_CORS_PATH,
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

  // seed
  await app.get(SeedsService).start();

  // Start server
  await app.listen(APP_PORT, () => {
    console.log(`Running API: ${APP_URL}`);
    console.log(`Running DOC: ${APP_URL}/${APP_DOCS_PATH}`);
  });
}

bootstrap();
