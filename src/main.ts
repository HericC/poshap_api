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

  // Security
  app.use(helmet());
  app.enableCors({
    origin: configService.get('APP_NAME') || '*',
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
  const appName = configService.get('APP_NAME') || 'DOC';
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(appName)
    .setDescription(`This a API documentation to ${appName}`)
    .setVersion(configService.get('APP_VERSION'))
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const customOptions: SwaggerCustomOptions = {
    explorer: false,
    customSiteTitle: configService.get('APP_NAME'),
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: '',
    },
  };
  SwaggerModule.setup(
    configService.get('APP_DOCS_PATH') || 'doc',
    app,
    document,
    customOptions,
  );

  // Start server
  const port = configService.get('APP_PORT') || 3000;
  await app.listen(port);
}

bootstrap();
