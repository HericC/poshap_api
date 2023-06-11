import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from './mail.service';

@Module({
  controllers: [],
  providers: [MailService, PrismaService],
  exports: [MailService],
})
export class MailModule {}
