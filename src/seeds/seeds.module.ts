import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SeedsService } from './seeds.service';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [SeedsService],
})
export class SeedsModule {}
