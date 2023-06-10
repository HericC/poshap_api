import { NestFactory } from '@nestjs/core';
import { exit } from 'process';
import { SeedsModule } from './seeds/seeds.module';
import { SeedsService } from './seeds/seeds.service';

async function bootstrap() {
  const app = await NestFactory.create(SeedsModule);
  const seedService = app.get(SeedsService);

  await seedService.start();

  exit(0);
}
bootstrap();
